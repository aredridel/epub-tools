import { readdir } from "node:fs/promises";
import { env } from "$env/dynamic/private";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	return { dir: await readdir(env.DATA_DIR) }
};
