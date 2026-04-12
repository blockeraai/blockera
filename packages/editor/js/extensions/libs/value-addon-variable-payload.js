// @flow

/**
 * Value-addon variables from the variable store use JSON in `settings.value`.
 * Variables chosen from global preset repeaters (var picker) may expose the same
 * data on `settings.items` / `settings.border` or as a parsed object in `value`.
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
	if (typeof raw === 'string') {
		try {
			const parsed = JSON.parse(raw);
			return Array.isArray(parsed?.items) ? parsed.items : [];
		} catch (e) {
			return [];
		}
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
	if (typeof raw === 'string' && raw !== '') {
		try {
			return JSON.parse(raw);
		} catch (e) {
			return null;
		}
	}
	if (raw && typeof raw === 'object') {
		return raw;
	}
	if (settings.border && typeof settings.border === 'object') {
		return settings.border;
	}
	return null;
}
