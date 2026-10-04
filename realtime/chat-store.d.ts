export type StoredAgent = {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  created_at: string;
  deleted: boolean;
  is_admin: boolean;
};

export function createAgent(input: {
  email: string;
  passwordHash: string;
  name?: string;
}): StoredAgent | null;
export function findAgentByEmail(email: string): StoredAgent | null;
export function hashPassword(password: string): string;
export function provisionAdminAccount(input: { email: string; password: string; name?: string }): StoredAgent | null;
export function updateAgentProfile(
  id: string,
  input: { name: string; email: string; password?: string },
  currentSessionId: string,
): StoredAgent | null;