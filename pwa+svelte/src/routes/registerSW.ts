import { useRegisterSW } from 'virtual:pwa-register/svelte';
import { dev } from '$app/environment';

const intervalMS = 60 * 60 * 1000;

useRegisterSW({
	onRegisteredSW(swScriptUrl, registration) {
		console.log(`SW Registered: ${registration}`);

		/* Periodically check for updates */
		if (registration) {
			setInterval(
				() => {
					console.log('Checking for updates');
					registration.update();
				},
				dev ? 3000 : intervalMS
			);
		}
	},
	onRegisterError(error) {
		console.log('SW registration error', error);
	},
	onNeedRefresh() {
		console.log(`SW needs refresh`);
	},
	onOfflineReady() {
		console.log(`SW was installed and is now ready to serve offline requests`);
	}
});
