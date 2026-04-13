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
): Array<mixed> {
	if (!settings || typeof settings !== 'object') {
		return [];
	}
	if (Array.isArray(settings.items)) {
		return settings.items;
	}
	const raw = settings.value;
	if (raw === null || raw === undefined || raw === '') {
		return [];
	}
	if (
		typeof raw === 'object' &&
		!Array.isArray(raw) &&
		Array.isArray(raw.items)
	) {
		return raw.items;
	}
	const legacy = tryParseLegacyJsonObject(raw);
	return Array.isArray(legacy?.items) ? legacy.items : [];
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
