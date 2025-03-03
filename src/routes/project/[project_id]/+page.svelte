<script lang="ts">
	import Edit from '$lib/Edit.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let d = $state(data);

	async function save() {
		const fd = new FormData();
		fd.append('title', d.title);
		fetch('?/setMetadata', { method: 'POST', body: fd });
	}
</script>

<h1>Project</h1>
<h2>
	{d.title}
	<Edit bind:value={d.title} onchange={save} />
</h2>
