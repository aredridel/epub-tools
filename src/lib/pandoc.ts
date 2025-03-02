import pandocUrl from "$lib/pandoc.wasm?url"
import { read } from "$app/server";
import { WASI } from "node:wasi"
import { join } from "node:path/posix";
import { basename, dirname } from "node:path";

const wasm = await WebAssembly.compile(
    await read(pandocUrl).arrayBuffer()
);

export async function convert(
    input: string,
    output: string,
    args: string[] = []
): Promise<void> {
    const dir = dirname(input);
    const file = basename(input);

    const wasi = new WASI({
        version: "preview1",
        args: [
            "pandoc",
            join("/tmp", file),
            "-o",
            join("/tmp", output),
            ...args
        ],
        env: {},
        preopens: {
            "/tmp": dir
        }
    });

    const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject() as any);

    wasi.start(instance);
}


