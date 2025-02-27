import pandocUrl from "$lib/pandoc.wasm?url"
import { read } from "$app/server";
import { WASI } from "node:wasi"
import { mkdir, writeFile, readFile, unlink, rmdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { type Stream } from "node:stream";

const wasm = await WebAssembly.compile(
    await read(pandocUrl).arrayBuffer()
);

export async function convert(
    input:
        | string
        | NodeJS.ArrayBufferView
        | Iterable<string | NodeJS.ArrayBufferView>
        | AsyncIterable<string | NodeJS.ArrayBufferView>
        | Stream,
    params: { from?: string; to?: string } = {}
): Promise<string> {
    const tmp = `${tmpdir()}/${Math.random()}`;
    try {
        await mkdir(tmp);

        const wasi = new WASI({
            version: "preview1",
            args: [
                "pandoc",
                `/tmp/input.md`,
                ...(params.from ? ["-f", params.from] : []),
                ...(params.to ? ["-t", params.to] : []),
                "-o",
                "/tmp/output.html"
            ],
            env: {},
            preopens: {
                "/tmp": tmp
            }
        });

        await writeFile(`${tmp}/input.md`, input)

        const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());
        // FIXME: delete tmp

        wasi.start(instance);
        return await readFile(`${tmp}/output.html`, 'utf-8');
    } finally {
        await unlink(`${tmp}/output.html`);
        await unlink(`${tmp}/input.md`);
        await rmdir(tmp);

    }
}


