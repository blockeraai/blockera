/**
 * WordPress dependencies
 */
import { useState, useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { localStorage } from '@blockera/storage';

export const RECENT_ICONS_STORAGE_KEY = 'blockera-icon-control-recent-icons';
export const MAX_RECENT_ICONS = 40;

/**
 * Build a stable id for a recent icon entry.
 *
 * @param {Object} entry Recent icon entry.
 * @return {string} Stable identifier.
 */
export function getRecentIconId(entry) {
	if (entry.type === 'library') {
		return `${entry.library}:${entry.icon}`;
	}

	if (
		entry.uploadSVG &&
		typeof entry.uploadSVG === 'object' &&
		entry.uploadSVG.url
	) {
		return `custom:${entry.uploadSVG.url}`;
	}

	if (entry.svgString) {
		return `custom:${hashString(entry.svgString)}`;
	}

	return `custom:${entry.id || 'unknown'}`;
}

/**
 * Simple string hash for custom SVG deduplication.
 *
 * @param {string} str Input string.
 * @return {string} Hash string.
 */
function hashString(str) {
	let hash = 5381;

	for (let i = 0, len = str.length; i < len; i++) {
		hash = (hash * 33 + str.charCodeAt(i)) % 2147483647;
	}

	return String(hash);
}

/**
 * Normalize a reducer action into a recent icon storage entry.
 *
 * @param {Object} action Reducer action (UPDATE_ICON or UPDATE_SVG).
 * @return {Object|null} Storage entry or null if invalid.
 */
export function actionToRecentIconEntry(action) {
	if (!action || !action.type) {
		return null;
	}

	if (action.type === 'UPDATE_ICON') {
		if (!action.icon || !action.library) {
			return null;
		}

		const entry = {
			type: 'library',
			icon: action.icon,
			library: action.library,
		};

		return { ...entry, id: getRecentIconId(entry) };
	}

	if (action.type === 'UPDATE_SVG') {
		const svgString = action.svgString || '';

		if (!svgString) {
			return null;
		}

		const entry = {
			type: 'custom',
			svgString,
			uploadSVG: action.uploadSVG || '',
		};

		return { ...entry, id: getRecentIconId(entry) };
	}

	return null;
}

/**
 * Validate and sanitize a stored recent icon entry.
 *
 * @param {Object} entry Raw entry from storage.
 * @return {Object|null} Valid entry or null.
 */
function sanitizeStoredEntry(entry) {
	if (!entry || typeof entry !== 'object') {
		return null;
	}

	if (entry.type === 'library') {
		if (!entry.icon || !entry.library) {
			return null;
		}

		const normalized = {
			type: 'library',
			icon: entry.icon,
			library: entry.library,
		};

		return { ...normalized, id: getRecentIconId(normalized) };
	}

	if (entry.type === 'custom') {
		if (!entry.svgString) {
			return null;
		}

		const normalized = {
			type: 'custom',
			svgString: entry.svgString,
			uploadSVG: entry.uploadSVG || '',
		};

		return { ...normalized, id: getRecentIconId(normalized) };
	}

	return null;
}

/**
 * Load recent icons from localStorage.
 *
 * @return {Array} Recent icon entries.
 */
export function loadRecentIcons() {
	try {
		const parsed = localStorage.getJSON(RECENT_ICONS_STORAGE_KEY);

		if (!Array.isArray(parsed)) {
			return [];
		}

		const seen = new Set();
		const result = [];

		for (const raw of parsed) {
			const entry = sanitizeStoredEntry(raw);

			if (!entry || seen.has(entry.id)) {
				continue;
			}

			seen.add(entry.id);
			result.push(entry);

			if (result.length >= MAX_RECENT_ICONS) {
				break;
			}
		}

		return result;
	} catch {
		return [];
	}
}

/**
 * Save recent icons to localStorage.
 *
 * @param {Array} items Recent icon entries.
 */
export function saveRecentIcons(items) {
	try {
		localStorage.setJSON(
			RECENT_ICONS_STORAGE_KEY,
			items.slice(0, MAX_RECENT_ICONS)
		);
	} catch {
		// localStorage might be full or disabled, ignore
	}
}

/**
 * Clear all recent icons from localStorage.
 */
export function clearRecentIconsFromStorage() {
	try {
		localStorage.removeItem(RECENT_ICONS_STORAGE_KEY);
	} catch {
		// localStorage might be full or disabled, ignore
	}
}

/**
 * Hook for managing recently used icons in localStorage.
 *
 * @return {Object} recentIcons, addRecentIcon, removeRecentIcon, clearRecentIcons
 */
export function useRecentIcons() {
	const [recentIcons, setRecentIcons] = useState(loadRecentIcons);

	const addRecentIcon = useCallback((action) => {
		const entry = actionToRecentIconEntry(action);

		if (!entry) {
			return;
		}

		setRecentIcons((prev) => {
			const filtered = prev.filter((item) => item.id !== entry.id);
			const next = [entry, ...filtered].slice(0, MAX_RECENT_ICONS);

			saveRecentIcons(next);

			return next;
		});
	}, []);

	const removeRecentIcon = useCallback((id) => {
		setRecentIcons((prev) => {
			const next = prev.filter((item) => item.id !== id);

			saveRecentIcons(next);

			return next;
		});
	}, []);

	const clearRecentIcons = useCallback(() => {
		setRecentIcons([]);
		clearRecentIconsFromStorage();
	}, []);

	return {
		recentIcons,
		addRecentIcon,
		removeRecentIcon,
		clearRecentIcons,
	};
}
