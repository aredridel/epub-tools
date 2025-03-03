<script lang="ts">
	let { value = $bindable(), onchange }: { onchange?: () => void; value: string } = $props();

	let editing = $state(false);

	let intermediate = $state(value);

    let dialog: HTMLDialogElement;

	function maybeAccept(ev: Event | KeyboardEvent) {
		if (!(ev.target instanceof HTMLElement)) return;
		if ((ev instanceof KeyboardEvent && ev.key === 'Enter') || ev.type === 'blur') {
			value = intermediate;
            dialog.close();
			onchange?.();
		} else if (ev instanceof KeyboardEvent && ev.key === 'Escape') {
			intermediate = value;
            dialog.close();
		}
	}
</script>

<button onclick={() => dialog.showModal()}>edit</button>
<dialog class="editor" bind:this={dialog}>
	<input type="text" bind:value={intermediate} onkeypress={maybeAccept} onblur={maybeAccept} />
</dialog>

<style>
	.editor {
		z-index: 1;
	}
</style>
