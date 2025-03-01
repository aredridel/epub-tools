import { fail, redirect } from "@sveltejs/kit";
import { getUserByUsername, getUserPasswordHash } from "$lib/server/user.ts";
import { verifyPasswordHash } from "$lib/server/password.ts";
import { createSession, setSessionTokenCookie } from "$lib/server/session.ts";

import type { Actions, PageServerLoadEvent, RequestEvent } from "./$types.ts";

export function load(event: PageServerLoadEvent) {
    if (event.locals.session !== null && event.locals.user !== null) {
        return redirect(302, "/");
    }
    return {};
}

export const actions: Actions = {
    default: action
};

async function action(event: RequestEvent) {
    const formData = await event.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");
    if (typeof username !== "string" || typeof password !== "string") {
        return fail(400, {
            message: "Invalid or missing fields",
            username: ""
        });
    }
    if (username === "" || password === "") {
        return fail(400, {
            message: "Please enter your username and password.",
            username
        });
    }
    const user = getUserByUsername(username);
    if (!user) {
        return fail(400, {
            message: "Account does not exist",
            username
        });
    }
    const passwordHash = getUserPasswordHash(user.user_id);
    const validPassword = await verifyPasswordHash(passwordHash, password);
    if (!validPassword) {
        return fail(400, {
            message: "Invalid password",
            username
        });
    }

    const session = createSession(user.user_id);
    setSessionTokenCookie(event, session.session_id, session.expires_at);

    return redirect(302, "/");
}

