import { readdir } from "node:fs/promises";
import { env } from "$env/dynamic/private";

export async function load() {
    return {dir: await readdir(env.DATA_DIR)}
}
