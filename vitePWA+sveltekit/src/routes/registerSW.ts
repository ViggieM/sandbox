import { dev } from "$app/environment";
import { useRegisterSW } from "virtual:pwa-register/svelte";
import {
  setNeedsRefresh,
  setUpdateServiceWorker,
} from "$lib/stores/sw.svelte";

// const intervalMS = 60 * 60 * 1000;
// for dev puposes:
const intervalMS = 3000;

const { needRefresh, updateServiceWorker, offlineReady } = useRegisterSW({
  onRegisteredSW(swScriptUrl, registration) {
    console.log(`SW Registered: ${registration}`);

    /* Periodically check for updates */
    if (registration) {
      setInterval(
        () => {
          console.log("Checking for updates");
          registration.update();
        },
        dev ? 3000 : intervalMS,
      );
    }
  },
  onRegisterError(error) {
    console.log("SW registration error", error);
  },
  onNeedRefresh() {
    setNeedsRefresh(true);
    console.log(`SW needs refresh`);
  },
  onOfflineReady() {
    console.log(`SW was installed and is now ready to serve offline requests`);
  },
});

// Store the updateServiceWorker function so it can be accessed from other components
setUpdateServiceWorker(updateServiceWorker);
