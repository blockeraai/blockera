/**
 * Overlays Blockera global-styles-ui settings onto block editor `__experimentalFeatures`.
 *
 * Keep in sync with PHP {@see blockera_merge_settings_into_experimental_features}.
 */

const BLOCKERA_ONLY_TOP_KEYS = [
	'transition',
	'transform',
	'filter',
	'textShadow',
] as const;

const RECURSIVE_MERGE_KEYS = [
	'shadow',
	'border',
	'dimensions',
	'typography',
	'layout',
	'spacing',
	'color',
] as const;

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function arrayReplaceRecursive(
	target: Record<string, unknown>,
	source: Record<string, unknown>
): Record<string, unknown> {
	const result: Record<string, unknown> = { ...target };

	for (const [key, value] of Object.entries(source)) {
		if (
			isPlainObject(value) &&
			isPlainObject(result[key]) &&
			!Array.isArray(result[key]) &&
			!Array.isArray(value)
		) {
			result[key] = arrayReplaceRecursive(
				result[key] as Record<string, unknown>,
				value
			);
		} else {
			result[key] = value;
		}
	}

	return result;
}

export function mergeBlockeraSettingsIntoExperimentalFeatures(
	currentFeatures: Record<string, unknown>,
	blockeraSettings: Record<string, unknown>
): Record<string, unknown> {
	const next = { ...currentFeatures };

	for (const key of BLOCKERA_ONLY_TOP_KEYS) {
		if (key in blockeraSettings) {
			next[key] = blockeraSettings[key];
		}
	}

	for (const key of RECURSIVE_MERGE_KEYS) {
		const value = blockeraSettings[key];
		if (isPlainObject(value)) {
			const existing = isPlainObject(next[key])
				? (next[key] as Record<string, unknown>)
				: {};
			next[key] = arrayReplaceRecursive(existing, value);
		}
	}

	if (isPlainObject(blockeraSettings.blocks)) {
		const existing = isPlainObject(next.blocks)
			? (next.blocks as Record<string, unknown>)
			: {};
		next.blocks = arrayReplaceRecursive(
			existing,
			blockeraSettings.blocks as Record<string, unknown>
		);
	}

	return next;
}
