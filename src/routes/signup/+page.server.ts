import { fail, redirect } from "@sveltejs/kit";
import { createUser, verifyUsernameInput } from "$lib/server/user.ts";
import { verifyPasswordStrength } from "$lib/server/password.ts";
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
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");
    if (typeof username !== "string" || typeof password !== "string") {
        return fail(400, {
            message: "Invalid or missing fields",
            email: "",
            username: ""
        });
    }
    if (password === "" || username === "") {
        return fail(400, {
            message: "Please enter your username and password",
            email: "",
            username: ""
        });
    }
    if (!verifyUsernameInput(username)) {
        return fail(400, {
            message: "Invalid username",
            email,
            username
        });
    }
    const strongPassword = await verifyPasswordStrength(password);
    if (!strongPassword) {
        return fail(400, {
            message: "Weak password",
            email,
            username
        });
    }
    const user = await createUser(username, password);

    const session = createSession(user.user_id);
    setSessionTokenCookie(event, session.session_id, session.expires_at);
    throw redirect(302, "/");
}

