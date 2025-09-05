<script lang="ts">
	import { toasts, removeToast } from '$lib/stores/notifications.svelte';
</script>

<!-- Toast Display Container -->
<div class="toast">
	{#each toasts as toast (toast.id)}
		<div
			class="alert flex"
			class:alert-info={toast.type === 'info'}
			class:alert-success={toast.type === 'success'}
			class:alert-warning={toast.type === 'warning'}
			class:alert-error={toast.type === 'error'}
		>
			<span class="grow">{toast.message}</span>
			<button class="btn btn-circle btn-ghost btn-sm" onclick={() => removeToast(toast.id)}>
				✕
			</button>
		</div>
	{/each}
</div>
