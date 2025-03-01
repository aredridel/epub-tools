import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/session.ts";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoadEvent } from "./$types";

export function load(event: PageServerLoadEvent) {
	if (event.locals.session) {
		invalidateSession(event.locals.session.session_id);
		deleteSessionTokenCookie(event);
	}
	redirect(303, '/');
}
