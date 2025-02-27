import { convert } from "$lib/pandoc.ts";
import type { Actions } from "./$types";

export async function load() {
	return { output: await convert("# test 123") };
}

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		// Set up folder
		// Write file
		// Do conversion
		console.log(event, data);
	}
} satisfies Actions;
