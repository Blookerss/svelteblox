<script lang="ts">
	import { onMount } from 'svelte';

	export let autoOpen = false;
	export const trigger = () => dialog.showModal();
	export const close = () => dialog.close();

	let dialog: HTMLDialogElement;

	if (autoOpen)
		onMount(trigger);
</script>

<dialog bind:this={dialog}>
	<slot/>
</dialog>

<style lang="scss">
	dialog {
		color: var(--color-primary);
		border: none;
		padding: 16px 24px;
		min-width: 40%;
		font-size: initial;
		animation: .5s show;
		max-height: 80%;
		background: var(--background-secondary);
		font-weight: initial;
		border-radius: 16px;
		:global(h1:first-child) {
			margin-top: 12px;
		}
		&::backdrop {
			animation: .5s show;
			background: #00000040;
		}
	}

	@keyframes show {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>