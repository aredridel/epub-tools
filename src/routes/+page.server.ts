import { readdir } from "node:fs/promises";
import { env } from "$env/dynamic/private";
import { redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	if (event.locals.user === null) {
		return redirect(302, "/login");
	}

	return { dir: await readdir(env.DATA_DIR), user: event.locals.user }
};
