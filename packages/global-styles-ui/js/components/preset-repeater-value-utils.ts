/**
 * Internal dependencies
 */
import type { VariableType } from './types';

/** RepeaterControl value: preset rows keyed by stable repeater item id (array index as string). */
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

function isNumericRepeaterItemId(itemId: string): boolean {
	return /^\d+$/.test(itemId);
}

function resolveRepeaterRowOrder(
	row: Record<string, unknown>,
	itemId: string
): number {
	if (typeof row.order === 'number') {
		return row.order;
	}

	if (isNumericRepeaterItemId(itemId)) {
		return Number(itemId);
	}

	return 0;
}

/**
 * Collapses slug-keyed and index-keyed duplicates, then re-keys rows by array index.
 * Used when theme preset arrays round-trip through the repeater so edits keep stable ids.
 */
export function normalizePresetRepeaterValueToIndexKeys(
	value: Record<string, unknown>
): PresetRepeaterValue {
	type Entry = { itemId: string; row: Record<string, unknown> };
	const sluglessEntries: Entry[] = [];
	const slugToEntry = new Map<string, Entry>();

	for (const [itemId, row] of Object.entries(value)) {
		if (!row || typeof row !== 'object' || Array.isArray(row)) {
			continue;
		}

		const record = row as Record<string, unknown>;
		const slug =
			record.slug !== null && record.slug !== undefined
				? String(record.slug)
				: '';

		if (slug) {
			const existing = slugToEntry.get(slug);

			if (existing) {
				const keepCurrent =
					isNumericRepeaterItemId(itemId) &&
					!isNumericRepeaterItemId(existing.itemId);

				if (keepCurrent) {
					slugToEntry.set(slug, { itemId, row: record });
				}

				continue;
			}

			slugToEntry.set(slug, { itemId, row: record });
			continue;
		}

		sluglessEntries.push({ itemId, row: record });
	}

	const merged = [...slugToEntry.values(), ...sluglessEntries];

	merged.sort((a, b) => {
		const orderA = resolveRepeaterRowOrder(a.row, a.itemId);
		const orderB = resolveRepeaterRowOrder(b.row, b.itemId);

		if (orderA !== orderB) {
			return orderA - orderB;
		}

		const numA = isNumericRepeaterItemId(a.itemId)
			? Number(a.itemId)
			: Number.POSITIVE_INFINITY;
		const numB = isNumericRepeaterItemId(b.itemId)
			? Number(b.itemId)
			: Number.POSITIVE_INFINITY;

		return numA - numB;
	});

	const out: PresetRepeaterValue = {};

	merged.forEach(({ row }, index) => {
		out[String(index)] = {
			...(row as VariableType & Record<string, unknown>),
			order:
				row.order !== undefined && row.order !== null
					? (row.order as number)
					: index + 1,
		};
	});

	return out;
}

/**
 * Normalizes preset variables for repeater controls, which expect `{ [itemId]: item }`.
 * Theme.json preset arrays are converted with index keys; existing object maps
 * (e.g. width-size custom group, fallback catalog) are returned unchanged.
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

	return normalizePresetRepeaterValueToIndexKeys(
		Object.fromEntries(
			value
				.map((row, index) => {
					if (!row || typeof row !== 'object' || Array.isArray(row)) {
						return null;
					}

					return [String(index), row as Record<string, unknown>];
				})
				.filter(
					(entry): entry is [string, Record<string, unknown>] =>
						entry !== null
				)
		)
	);
}
