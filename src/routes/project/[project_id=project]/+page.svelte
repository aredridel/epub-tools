<script lang="ts">
	import { browser } from "$app/environment";
	import { resolveRoute } from "$app/paths";
	import { page } from "$app/state";
	import Edit from "$lib/Edit.svelte";

	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();

	let d = $state(data);

	async function save() {
		const fd = new FormData();
		fd.append("title", d.title);
		fetch("?/setMetadata", { method: "POST", body: fd });
	}
</script>

<h1>Project</h1>
<h2>
	{d.title}
	<Edit bind:value={d.title} onchange={save} />
</h2>

<iframe
	src={resolveRoute("/project/[project_id]/book/[asset]", {
		project_id: page.params.project_id,
		asset: "body.html"
	})}
	title="Book"
></iframe>

{#if browser}
	{#await import("$lib/epub.svelte") then { default: Epub }}
		<Epub book=""></Epub>
	{/await}
{/if}
