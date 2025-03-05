import { relative, resolve } from "node:path";
import type { RequestEvent } from "./$types";
import { fail } from "@sveltejs/kit";
import { readFile } from "node:fs/promises";

export async function GET(ev: RequestEvent) {
	const root = resolve("data", ev.locals.user.user_id, ev.params.project_id);
	const filename = resolve(root, ev.params.asset);
	if (!relative(root, filename).includes("..")) {
		return new Response(await readFile(filename));
	} else {
		return fail(400);
	}
}
