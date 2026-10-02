// Launches the realtime WebSocket server alongside the app in one process tree.
//
// Usage:
//   bun scripts/run-dev.mjs            -> bun realtime/server.js + react-router dev
//   bun scripts/run-dev.mjs start      -> bun realtime/server.js + react-router-serve
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const realtimeEntry = path.join(root, "realtime", "server.js");
const mode = process.argv[1] === "start" ? "start" : "dev";
const bunBin = process.execPath; // current bun binary (we run through `bun scripts/run-dev.mjs`)
const reactRouterBin = path.join(root, "node_modules", "@react-router", "dev", "bin.cjs");
const serveBin = path.join(root, "node_modules", "@react-router", "serve", "bin.cjs");

function spawnLogged(name, args, env = {}) {
  const child = spawn(bunBin, args, {
    cwd: root,
    env: { ...process.env, ...env },
    stdio: ["inherit", "inherit", "inherit"],
    windowsHide: true,
  });
  child.on("error", (err) => console.error(`[${name}] spawn error:`, err.message || err));
  child.on("exit", (code, signal) => console.log(`[${name}] exited (code=${code}, signal=${signal})`));
  return child;
}

const children = [
  spawnLogged("realtime", [realtimeEntry], { REALTIME_PORT: String(process.env.REALTIME_PORT || "8787") }),
];

if (mode === "start") {
  children.push(spawnLogged("app", [serveBin, path.join(root, "build", "server", "index.js")]));
} else {
  children.push(spawnLogged("app", [reactRouterBin, "dev"]));
}

const shutdown = () => {
  for (const child of children) {
    try { child.kill("SIGTERM"); } catch {}
  }
  setTimeout(() => {
    for (const child of children) {
      try { child.kill("SIGKILL"); } catch {}
    }
  }, 3000).unref();
};
for (const sig of ["SIGINT", "SIGTERM"]) process.once(sig, shutdown);
await new Promise(() => {});
