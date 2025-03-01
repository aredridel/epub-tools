import { db } from "$lib/server/db.ts";
import "$lib/server/user.ts";
import type { RequestEvent } from "@sveltejs/kit";
import type { User } from "./user";
import { randomID } from "./util";

db.exec(`CREATE TABLE IF NOT EXISTS session(
    session_id TEXT NOT NULL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES user(user_id),
    expires_at INTEGER NOT NULL
) STRICT;`);

export function createSession(user_id: string): Session {
    const session_id = randomID("session");
    const session: Session = {
        session_id,
        user_id,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    };
    const insert = db.prepare(
        "INSERT INTO session (session_id, user_id, expires_at) VALUES (?, ?, ?)"
    );
    insert.run(
        session.session_id,
        session.user_id,
        Math.floor(session.expires_at.getTime() / 1000)
    );
    return session;
}

export function validateSessionToken(session_id: string): SessionValidationResult {
    const getSession = db.prepare(`SELECT
        session_id,
        user_id,
        expires_at,
        user.username AS username
        FROM session
        INNER JOIN user USING (user_id)
        WHERE session_id = ?`);
    const row = getSession.get(session_id) as null | { session_id: string, user_id: string, expires_at: number, username: string };
    if (!row) {
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
            session.session_id
        );
    }
    return { session, user };
}

export function invalidateSession(session_id: string): void {
    if (!session_id) return;
    const del = db.prepare("DELETE FROM session WHERE session_id = :session_id");
    del.run({ session_id });
}

export async function invalidateAllSessions(user_id: string): Promise<void> {
    const del = db.prepare("DELETE FROM session WHERE user_id = :user_id");
    del.run({ user_id });
}

export type SessionValidationResult =
    | { session: Session; user: User }
    | { session: null; user: null };

export interface Session {
    session_id: `session-${string}`;
    user_id: string;
    expires_at: Date;
}

export function setSessionTokenCookie(event: RequestEvent, session_id: string, expires_at: Date): void {
    event.cookies.set("session", session_id, {
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
