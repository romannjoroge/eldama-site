// Seeds a test agent account for local login.
// Usage: bun scripts/seed.ts
import { createAgent, findAgentByEmail, hashPassword } from "../realtime/chat-store.js";

// Get email and password from input or env
let email = "";
let password = "";

if (process.argv.length == 4) {
  email = process.argv[2]
  password = process.argv[3]
} else if (process.env.TEST_AGENT_EMAIL && process.env.TEST_AGENT_PASSWORD) {
  email = process.env.TEST_AGENT_EMAIL;
  password = process.env.TEST_AGENT_PASSWORD
} else {
  console.log("Please pass agent email or password as arguement or fill in TEST_AGENT_EMAIL and TEST_AGENT_PASSWORD envs");
  process.exit(0);
}

const name = "Support Agent";

const existing = findAgentByEmail(email);
if (existing) {
  console.log(`[seed] agent ${email} already exists`);
  process.exit(0);
}

createAgent({ email, passwordHash: hashPassword(password), name });
console.log(`[seed] created agent ${email} (${name})`);
