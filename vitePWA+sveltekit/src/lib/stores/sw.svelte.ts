// ABOUTME: Store for service worker state and update functionality
// ABOUTME: Provides reactive state and methods for SW updates and refresh status

let needsRefresh = $state(false);
let updateSW: ((reloadPage?: boolean) => Promise<void>) | null = null;

export function setNeedsRefresh(newState: boolean) {
  needsRefresh = newState;
}

export function getNeedsRefresh() {
  return needsRefresh;
}

export function setUpdateServiceWorker(
  updateFn: (reloadPage?: boolean) => Promise<void>,
) {
  updateSW = updateFn;
}

export function getUpdateServiceWorker() {
  return updateSW;
}
