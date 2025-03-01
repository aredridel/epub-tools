<script lang="ts">
	import { page } from '$app/state';
</script>

<a href="upload">Upload</a>

User "{page.data.user.username}"
TODO: Logout

<pre>
{JSON.stringify(page.data, null, 2)}
</pre>
