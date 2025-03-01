<script lang="ts">
	import { page } from '$app/state';
	import Layout from '$lib/frame/Layout.svelte';
</script>

<Layout>
	<a href="upload">Upload</a>

	User "{page.data.user.username}" TODO: Logout

	<pre>{JSON.stringify(page.data, null, 2)}</pre>
</Layout>
