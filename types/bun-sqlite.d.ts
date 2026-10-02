declare module "bun:sqlite" {
  type RunResult = {
    changes: number;
    lastInsertRowid: number | bigint;
  };

  type Statement<Row extends Record<string, unknown> = Record<string, unknown>> = {
    all(...params: unknown[]): Row[];
    get(...params: unknown[]): Row | null;
    run(...params: unknown[]): RunResult;
  };

  export class Database {
    constructor(filename: string);
    query<Row extends Record<string, unknown> = Record<string, unknown>>(sql: string): Statement<Row>;
    run(sql: string, params?: unknown[]): RunResult;
    close(): void;
  }
}

interface ImportMeta {
  readonly dir: string;
}