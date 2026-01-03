/**
 * localStorage utilities for zoom persistence.
 */

import { DEFAULT_ZOOM, MAX_ZOOM, MIN_ZOOM, STORAGE_KEY } from './constants';
import type { ZoomPercent } from '../types';

/**
 * Load zoom percentage from localStorage.
 * Returns default zoom if no valid value is stored.
 *
 * @returns The zoom percentage from storage, or default if not found/invalid.
 */
export function loadZoomFromStorage(): ZoomPercent {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);

		if (stored) {
			const zoom = parseInt(stored, 10);

			// Validate zoom is within acceptable range
			if (
				!isNaN(zoom) &&
				zoom >= MIN_ZOOM &&
				zoom <= MAX_ZOOM
			) {
				return zoom;
			}
		}
	} catch {
		// Silently fail if localStorage is not available (e.g., private browsing)
		// Return default zoom as fallback
	}

	return DEFAULT_ZOOM;
}

/**
 * Save zoom percentage to localStorage.
 * Silently fails if localStorage is not available.
 *
 * @param zoomPercent - The zoom percentage to save.
 */
export function saveZoomToStorage(zoomPercent: ZoomPercent): void {
	try {
		localStorage.setItem(STORAGE_KEY, zoomPercent.toString());
	} catch {
		// Silently fail if localStorage is not available
		// This can happen in private browsing mode or when storage is full
	}
}
