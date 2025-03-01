import { db } from "$lib/server/db.ts";
import { hashPassword } from "$lib/server/password.ts";
import { error } from "@sveltejs/kit";
import { randomID } from "./util";

db.exec(`CREATE TABLE IF NOT EXISTS user (
    user_id TEXT NOT NULL PRIMARY KEY,
    username TEXT NOT NULL,
    hashed_password TEXT NOT NULL
) STRICT;`);

db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS username_key ON user (username);`);

const preparedGetUserByUsername = db.prepare("SELECT user_id, username FROM user WHERE username = ?");
const preparedGetUserPasswordHash = db.prepare("SELECT hashed_password FROM user WHERE user_id = ?");

export interface User {
	user_id: `user-${string}`;
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
	try {
		const passwordHash = await hashPassword(password);
		const user_id = randomID('user');
		const createQ = db.prepare("INSERT INTO user (user_id, username, hashed_password) VALUES (?, ?, ?)");
		createQ.run(user_id, username, passwordHash);
		const getUser = db.prepare("SELECT user_id, username FROM user WHERE user_id = ?");

		return getUser.get(user_id) as User;
	} catch (e) {
		if (!(e instanceof Error)) throw e;
		if ("code" in e && "errcode" in e
			&& e.code === "ERR_SQLITE_ERROR" && e.errcode === 2067 /* Unique constraint */) {
			error(409, "Username already in use");
		} else {
			throw e;
		}
	}
}

