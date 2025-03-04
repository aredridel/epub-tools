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

<div>
	<button onclick={() => dialog.showModal()}>edit</button>
	<dialog class="editor" bind:this={dialog}>
		<input type="text" bind:value={intermediate} onkeypress={maybeAccept} onblur={maybeAccept} />
	</dialog>
</div>

<style>
	div {
		margin-inline-start: 0.5ch;
		position: absolute;
		display: inline-block;
	}
	button {
		cursor: pointer;
		display: inline-block;
		appearance: none;
		background: none;
		border: none;
		vertical-align: 1em;
		text-decoration: underline;
	}
	.editor {
		border: 1px solid black;
	}
	.editor:modal {
		position: relative;
		margin: unset;
		z-index: 1;
		top: unset;
		bottom: unset;
		left: unset;
		right: unset;
	}
</style>
