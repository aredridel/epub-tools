import {
    validateSessionToken,
    setSessionTokenCookie,
    deleteSessionTokenCookie
} from "$lib/server/session.ts";

import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const session_id = event.cookies.get("session") ?? null;
    if (!session_id) {
        event.locals.user = null;
        event.locals.session = null;
        return resolve(event);
    }

    const { session, user } = validateSessionToken(session_id);
    if (session) {
        setSessionTokenCookie(event, session_id, session.expires_at);
    } else {
        deleteSessionTokenCookie(event);
    }

    event.locals.session = session;
    event.locals.user = user;
    return resolve(event);
};

