// @flow

/**
 * External dependencies
 */
import { tryParseLegacyJsonObject } from '@blockera/data';

/**
 * Variable preset rows: `settings.items`, object `settings.value`, or legacy JSON string (pre-feat/variables saves).
 */

export function getVariableRepeaterItemsFromSettings(
	settings: ?Object
): Array<mixed> | string {
	if (!settings || typeof settings !== 'object') {
		return [];
	}
	if (Array.isArray(settings.items)) {
		return settings.items;
	}
	// Global style presets: `{ items: "<css>" }` (box-shadow / text-shadow theme.json shape).
	if (typeof settings.items === 'string' && settings.items.trim() !== '') {
		return settings.items.trim();
	}
	const raw = settings.value;
	if (raw === null || raw === undefined || raw === '') {
		return [];
	}
	if (
		typeof raw === 'object' &&
		!Array.isArray(raw) &&
		raw.items !== undefined
	) {
		if (Array.isArray(raw.items)) {
			return raw.items;
		}
		if (typeof raw.items === 'string' && raw.items.trim() !== '') {
			return raw.items.trim();
		}
	}
	const legacy = tryParseLegacyJsonObject(raw);
	if (Array.isArray(legacy?.items)) {
		return legacy.items;
	}
	return [];
}

export function parseBorderVariablePayloadFromSettings(
	settings: ?Object
): ?Object {
	if (!settings || typeof settings !== 'object') {
		return null;
	}
	const raw = settings.value;
	if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
		return raw;
	}
	if (typeof raw === 'string' && raw !== '') {
		const legacy = tryParseLegacyJsonObject(raw);
		if (legacy) {
			return legacy;
		}
	}
	if (settings.border && typeof settings.border === 'object') {
		return settings.border;
	}
	return null;
}
