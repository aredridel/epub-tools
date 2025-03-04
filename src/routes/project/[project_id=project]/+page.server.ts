import path from "node:path";
import type { Actions, PageServerLoadEvent } from "./$types";
import { readFile } from "node:fs/promises";
import { whenCode } from "$lib/error";

interface Metadata {
    title?: string;
}

export async function load(event: PageServerLoadEvent) {
    const projectDir = path.join("data", event.params.project_id);
    const metadata = JSON.parse(await readFile(path.join(projectDir, "metadata.json"), "utf-8")
        .catch(whenCode("ENOENT", () => "{}"))) as Metadata;
    return { title: metadata.title ?? "Untitled" }
}

export const actions = {
    async generate(event) {
        event;
        // Convert sources to EPUB
    },

    async setMetadata(event) {
        const update = await event.request.formData();
        // FIXME: use update

    }
} satisfies Actions;
