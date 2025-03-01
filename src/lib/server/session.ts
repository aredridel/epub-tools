import { db } from "$lib/server/db.ts";
import "$lib/server/user.ts";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { RequestEvent } from "@sveltejs/kit";
import type { User } from "./user";

db.exec(`CREATE TABLE IF NOT EXISTS session(
    session_id TEXT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user(id),
    expires_at INTEGER NOT NULL
) STRICT;`);


export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
}

export function createSession(token: string, user_id: string): Session {
    const session_id = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: Session = {
        session_id,
        user_id,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    };
    const insert = db.prepare(
        "INSERT INTO session (id, user_id, expires_at) VALUES (?, ?, ?)"
    );
    insert.run(
        session.session_id,
        session.user_id,
        Math.floor(session.expires_at.getTime() / 1000)
    );
    return session;
}

export function validateSessionToken(token: string): SessionValidationResult {
    const session_id = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const getSession = db.prepare(`SELECT
        session.session_id,
        session.user_id,
        session.expires_at,
        user.username AS username
        FROM session
        INNER JOIN user USING (user_id)
        WHERE session.id = ?`);
    const row = getSession.get(session_id) as null | { session_id: string, user_id: string, expires_at: number, username: string };
    if (row === null) {
        return { session: null, user: null };
    }
    const session: Session = {
        session_id: row.session_id,
        user_id: row.user_id,
        expires_at: new Date(row.expires_at * 1000)
    };
    const user: User = {
        user_id: row.user_id,
        username: row.username
    };
    if (Date.now() >= session.expires_at.getTime()) {
        const del = db.prepare("DELETE FROM session WHERE id = ?");
        del.run(session.session_id);
        return { session: null, user: null };
    }
    if (Date.now() >= session.expires_at.getTime() - 1000 * 60 * 60 * 24 * 15) {
        session.expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        const update = db.prepare(
            "UPDATE session SET expires_at = ? WHERE id = ?"
        );
        update.run(
            Math.floor(session.expires_at.getTime() / 1000),
            session.id
        );
    }
    return { session, user };
}

export function invalidateSession(session_id: string): void {
    const del = db.prepare("DELETE FROM session WHERE id = ?");
    del.run(session_id);
}

export async function invalidateAllSessions(user_id: string): Promise<void> {
    const del = db.prepare("DELETE FROM user_session WHERE user_id = ?");
    del.run(user_id);
}

export type SessionValidationResult =
    | { session: Session; user: User }
    | { session: null; user: null };

export interface Session {
    session_id: string;
    user_id: string;
    expires_at: Date;
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expires_at: Date): void {
    event.cookies.set("session", token, {
        httpOnly: true,
        sameSite: "lax",
        expires: expires_at,
        path: "/"
    });
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
    event.cookies.set("session", "", {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 0,
        path: "/"
    });
}
