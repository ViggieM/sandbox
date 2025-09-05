<!-- ABOUTME: Toast functionality page with DaisyUI styling and Svelte 5 runes -->
<!-- ABOUTME: Provides minimal toast system with store-based state management -->

<script lang="ts">
	import { addToast } from '$lib/stores/notifications.svelte';
	import Notifications from './Notifications.svelte';
</script>

<Notifications />

<!-- Main Content -->
<div class="p-4">
	<div class="mx-auto prose">
		<h1>Toast Examples</h1>
		<p>Click the buttons below to trigger different types of toasts:</p>
	</div>

	<!-- Trigger Buttons -->
	<div class="mt-6 flex justify-center gap-4">
		<button class="btn btn-info" onclick={() => addToast('This is an info message', 'info')}>
			Show Info
		</button>

		<button
			class="btn btn-success"
			onclick={() => addToast('Operation completed successfully!', 'success')}
		>
			Show Success
		</button>

		<button
			class="btn btn-warning"
			onclick={() => addToast('Please be careful with this action', 'warning')}
		>
			Show Warning
		</button>

		<button
			class="btn btn-error"
			onclick={() => addToast('An error occurred while processing', 'error')}
		>
			Show Error
		</button>
	</div>
</div>
