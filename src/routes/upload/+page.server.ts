import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { mkdir, writeFile } from "node:fs/promises";
import { whenCode } from "$lib/error";
import path from "node:path";
import { convert } from "$lib/pandoc.ts";
import { randomID } from "$lib/server/util";
import { resolveRoute } from "$app/paths";
export async function load() {
	return {output: ""}
}

export const actions = {
	default: async (event) => {
		const user = event.locals.user;
		if (!user) return fail(403);
		const data = await event.request.formData();
		const upload = data.get("upload");
		console.log(event, data, upload, 'u');
		if (!(upload instanceof File)) return fail(400, {message: "Not acceptable"});
		const project_id = randomID("project");
		const userDir = path.join("data", user.user_id);
		await mkdir(userDir).catch(whenCode("EEXIST", () => true));
		const projectDir = path.join("data", user.user_id, project_id)
		await mkdir(projectDir);
		const uploaded = path.join(projectDir, upload.name);
		await writeFile(uploaded, Buffer.from(await upload.arrayBuffer()));
		await convert(uploaded, "body.html");
		redirect(303, resolveRoute("/project/[project_id]", {project_id}));
	}
} satisfies Actions;
