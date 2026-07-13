/**
 * Overlays Blockera global-styles-ui settings onto block editor `__experimentalFeatures`.
 *
 * Keep in sync with PHP {@see blockera_merge_settings_into_experimental_features}.
 */

import { BLOCKERA_SETTINGS_KEYS } from '@blockera/data';

const CORE_RECURSIVE_MERGE_KEYS = [
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

	for (const key of BLOCKERA_SETTINGS_KEYS) {
		if (key in blockeraSettings) {
			next[key] = blockeraSettings[key];
		}
	}

	for (const key of CORE_RECURSIVE_MERGE_KEYS) {
		const value = blockeraSettings[key];
		if (!isPlainObject(value)) {
			continue;
		}

		const existing = isPlainObject(next[key])
			? (next[key] as Record<string, unknown>)
			: {};
		next[key] = arrayReplaceRecursive(
			existing,
			value as Record<string, unknown>
		);
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
