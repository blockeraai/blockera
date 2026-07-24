/**
 * Cypress helpers for site-scoped Blockera browser storage keys.
 *
 * Production keys are `{baseKey}__{siteKey}_u{userId}` (see @blockera/storage getStorageKey).
 */

/**
 * Resolve the scoped storage key using PHP-injected window globals.
 *
 * @param {Window} win
 * @param {string} baseKey Logical (unscoped) key.
 * @return {string}
 */
export function getScopedStorageKey(win, baseKey) {
	const siteKey = win.blockeraStorageSiteKey
		? String(win.blockeraStorageSiteKey)
		: '0';
	const userId =
		win.blockeraStorageUserId !== undefined &&
		win.blockeraStorageUserId !== null
			? Number(win.blockeraStorageUserId)
			: 0;

	return `${baseKey}__${siteKey}_u${userId}`;
}

/**
 * Remove a logical key and any site/user scoped variants from localStorage.
 * Safe in onBeforeLoad (before site key globals are injected).
 *
 * @param {Storage} storage
 * @param {string} baseKey
 */
export function removeScopedStorageKeys(storage, baseKey) {
	const prefix = `${baseKey}__`;
	const toRemove = [];

	for (let i = 0; i < storage.length; i++) {
		const key = storage.key(i);
		if (key === baseKey || (key && key.startsWith(prefix))) {
			toRemove.push(key);
		}
	}

	toRemove.forEach((key) => {
		storage.removeItem(key);
	});
}
