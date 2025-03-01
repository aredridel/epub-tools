<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, menu, logo }: { logo: Snippet; children: Snippet; menu: Snippet } = $props();
</script>

<div class="layout">
	<nav>
		{@render logo?.()}
		{@render menu?.()}
	</nav>
	<main>
		{@render children?.()}
	</main>
</div>

<style>
	.layout {
		display: grid;
		grid-template: 'sidebar main' 1fr / min-content auto;
		gap: 1rlh;
		min-height: 100%;
	}
	nav {
		padding: 1rlh;
	}
	main {
		padding: 1rlh;
		grid-area: main;
	}
</style>
