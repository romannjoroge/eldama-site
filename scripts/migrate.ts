// Runs plain .sql migration files from ./migrations in filename order.
// Usage: bun scripts/migrate.ts [--fresh]
import { Database } from "bun:sqlite";
import { mkdir, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dir, "..");
const migrationsDir = path.join(root, "migrations");
const dataDir = path.join(root, "data");
const dbPath = process.env.CHAT_DB_PATH || path.join(dataDir, "chat.sqlite");
const fresh = process.argv.includes("--fresh");

await mkdir(path.dirname(dbPath), { recursive: true });

if (fresh) {
  await (await import("node:fs/promises")).rm(dbPath, { force: true });
}

const db = new Database(dbPath);
db.run("PRAGMA foreign_keys = ON");
db.run("PRAGMA journal_mode = WAL");

db.run(`CREATE TABLE IF NOT EXISTS _migrations (
  name TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL
)`);

const entries = (await readdir(migrationsDir))
  .filter((name) => name.endsWith(".sql"))
  .sort();

if (entries.length === 0) {
  console.log("[migrate] no migration files found");
  process.exit(0);
}

const applied = new Set(
  db.query<{ name: string }>("SELECT name FROM _migrations").all().map((row) => row.name),
);

let ran = 0;
for (const name of entries) {
  if (applied.has(name)) continue;
  const sql = await readFile(path.join(migrationsDir, name), "utf8");
  db.run("BEGIN");
  try {
    db.run(sql);
    db.run("INSERT INTO _migrations (name, applied_at) VALUES (?, ?)", [
      name,
      new Date().toISOString(),
    ]);
    db.run("COMMIT");
  } catch (error) {
    db.run("ROLLBACK");
    console.error(`[migrate] failed applying ${name}:`, error);
    process.exit(1);
  }
  console.log(`[migrate] applied ${name}`);
  ran += 1;
}

console.log(ran === 0 ? "[migrate] up to date" : `[migrate] applied ${ran} migration(s)`);
db.close();
