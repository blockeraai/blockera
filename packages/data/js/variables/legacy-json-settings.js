// @flow

/**
 * Older releases stored structured variable payloads in `settings.value` as JSON strings.
 * New code uses plain objects; this parses legacy `{"items":...}` / border / radius shapes only.
 */
export function tryParseLegacyJsonObject(raw: mixed): ?Object {
	if (typeof raw !== 'string' || raw === '') {
		return null;
	}
	const t = raw.trim();
	if (t === '' || t[0] !== '{') {
		return null;
	}
	try {
		const parsed = JSON.parse(raw);
		if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
			return parsed;
		}
	} catch (e) {
		return null;
	}
	return null;
}
