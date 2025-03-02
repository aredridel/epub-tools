# EPUB Tools

This is very bare-bones so far

It’s a SvelteKit project.

You can get it running by cloning it, running `pnpm install` then `pnpm run dev`. 

It’s a full stack NodeJS app; it needs a very current NodeJS (version 23), since it’s using WebAssembly and WASI, and the SQLite bindings.

It’s kinda idiosyncratic right now, but should not be too hard to understand the structure of, such as it is.

It’s meant for small servers and stand-alone deployment, so it uses SQLite, and stores everything in the `data/` directory.

My approach is going to be “layers of non-destructive edits”: the base HTML can be incrementally improved until it can generate a whole ebook by applying steps like [the Standard Ebooks production steps](https://standardebooks.org/contribute/producing-an-ebook-step-by-step) to yield a fully edited EPUB file. By staying with non-destructive edits, we end up with a relatively small list of things that we’re actually manipulating in the user interface and it should stay well-structured into stages for the production pipeline, and since the amount of data in the system is small, the processing times are seconds at most.




