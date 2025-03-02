import { readdir } from "node:fs/promises";
import { whenCode } from "$lib/error";
import type { PageServerLoadEvent } from "./$types";

export async function load(event: PageServerLoadEvent) {
    const dir = await readdir(`data/${event.locals.user.user_id}`)
        .catch(whenCode("ENOENT", () => [] as string[]));
    return { dir }
}
