/**
 * Internal dependencies
 */
import type { VariableType } from './types';

/** RepeaterControl value: preset rows keyed by repeater item id (slug when available). */
export type PresetRepeaterValue = Record<
	string,
	VariableType & Record<string, unknown>
>;

/** Parent-facing preset list (theme.json arrays) or an already-normalized repeater map. */
export type PresetVariablesInput = VariableType[] | PresetRepeaterValue;

export function isPresetRepeaterObjectValue(
	value: unknown
): value is PresetRepeaterValue {
	return (
		value !== null &&
		value !== undefined &&
		typeof value === 'object' &&
		!Array.isArray(value)
	);
}

function resolvePresetRepeaterItemKey(
	row: Record<string, unknown>,
	index: number,
	usedKeys: Set<string>
): string {
	const slug =
		row.slug !== null && row.slug !== undefined && String(row.slug) !== ''
			? String(row.slug)
			: '';

	if (slug && !usedKeys.has(slug)) {
		return slug;
	}

	const id =
		row.id !== null && row.id !== undefined && String(row.id) !== ''
			? String(row.id)
			: '';

	if (id && !usedKeys.has(id)) {
		return id;
	}

	let fallback = String(index);

	while (usedKeys.has(fallback)) {
		fallback = `${index}-${usedKeys.size}`;
	}

	return fallback;
}

/**
 * Normalizes preset variables for repeater controls, which expect `{ [itemId]: item }`.
 * Theme.json preset arrays are converted with slug (or id/index fallback) keys; existing object
 * maps (e.g. width-size custom group, fallback catalog) are returned unchanged.
 */
export function variablesToPresetRepeaterValue(
	value: unknown
): PresetRepeaterValue {
	if (value === null || value === undefined) {
		return {};
	}

	if (isPresetRepeaterObjectValue(value)) {
		return value;
	}

	if (!Array.isArray(value)) {
		return {};
	}

	const out: PresetRepeaterValue = {};
	const usedKeys = new Set<string>();

	value.forEach((row, index) => {
		if (!row || typeof row !== 'object' || Array.isArray(row)) {
			return;
		}

		const record = row as Record<string, unknown>;
		const key = resolvePresetRepeaterItemKey(record, index, usedKeys);

		usedKeys.add(key);
		out[key] = {
			...(record as VariableType & Record<string, unknown>),
			order:
				record.order !== undefined && record.order !== null
					? (record.order as number)
					: index + 1,
		};
	});

	return out;
}
