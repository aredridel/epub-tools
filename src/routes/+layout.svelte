<script lang="ts">
	import '../app.css';
	import { Layout } from '$lib/frame/index.ts';
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import type { PageProps } from './$types';

	let { children, data }: { children: Snippet; data: PageProps['data'] } = $props();
</script>

<Layout>
	{#snippet logo()}
		<a href="/">Logo</a>
	{/snippet}
	{#snippet menu()}
		<p>
			{#if data.user}
				Logged in as {data.user.username}
			{/if}
		</p>
		<ul>
			{#if !data.user}
				<li><a href="login">Login</a></li>
				<li><a href="signup">Signup</a></li>
			{:else}
				<li><a href="upload">Upload</a></li>
				<li><a href="logout">Logout</a></li>
			{/if}
		</ul>
	{/snippet}
	{@render children?.()}
</Layout>
