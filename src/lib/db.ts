import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface DBUser {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

const DB_FILE_PATH = path.join(process.cwd(), "gitproof_users.json");

function readUsersFromDisk(): DBUser[] {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify([]), "utf-8");
      return [];
    }
    const data = fs.readFileSync(DB_FILE_PATH, "utf-8");
    return JSON.parse(data) as DBUser[];
  } catch {
    return [];
  }
}

function writeUsersToDisk(users: DBUser[]) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing user database to disk:", err);
  }
}

/**
 * SHA-256 password hashing utility (built into Node.js crypto module)
 */
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(`gitproof_salt_${password}`).digest("hex");
}

export function findUserByEmail(email: string): DBUser | undefined {
  const users = readUsersFromDisk();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUserInDB(email: string, passwordHash: string): DBUser {
  const users = readUsersFromDisk();
  const newUser: DBUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    email: email.toLowerCase().trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsersToDisk(users);
  return newUser;
}
