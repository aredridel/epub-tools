import { db } from "$lib/server/db.ts";
import { hashPassword } from "$lib/server/password.ts";

db.exec(`CREATE TABLE IF NOT EXISTS user (
    user_id TEXT NOT NULL PRIMARY KEY,
    username TEXT NOT NULL,
    hashed_password TEXT NOT NULL
) STRICT;`);

db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS username_key ON user (username);`);

const preparedGetUserByUsername = db.prepare("SELECT user_id, username FROM user WHERE username = ?");
const preparedGetUserPasswordHash = db.prepare("SELECT hashed_password FROM user WHERE id = ?");

export interface User {
	user_id: string;
	username: string;
}

export function getUserByUsername(username: string): User | undefined {
	return preparedGetUserByUsername.get(username) as User | undefined;
}
export function getUserPasswordHash(user_id: string): string | undefined {
	return (preparedGetUserPasswordHash.get(user_id) as { hashed_password: string } | null)?.hashed_password;
}

export function verifyUsernameInput(username: string): boolean {
	return username.length > 3 && username.length < 32 && username.trim() === username;
}

export async function createUser(username: string, password: string): Promise<User> {
	const passwordHash = await hashPassword(password);
	const getUser = db.prepare("INSERT INTO user (username, hashed_password) VALUES (?, ?) RETURNING user.user_id");
	const row = getUser.get(username, passwordHash) as { user_id: string };

	const user: User = {
		user_id: row.user_id,
		username
	};
	return user;
}

