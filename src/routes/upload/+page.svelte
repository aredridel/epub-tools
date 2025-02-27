<script lang="ts">
	import { page } from '$app/state';
</script>

<form method="post" enctype="multipart/form-data">
	<input type="file" name="upload" />
	<button type="submit">Upload</button>
</form>

{@html page.data.output}
