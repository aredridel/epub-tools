<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h1>Projects</h1>

{#each data.dir as d}
	<a href="/project/{d}">{d}</a>
{:else}
	You have no projects.
{/each}

<p><a href="/upload">Start a new project</a></p>
