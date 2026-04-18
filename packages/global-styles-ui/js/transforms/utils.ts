/**
 * WordPress theme.json transform preset (settings.transform.presets).
 * Each preset stores `items`: transform rows matching TransformControl repeater fields.
 */
import { getSortedRepeater } from '@blockera/controls';

export type TransformPresetItem = {
	type: 'move' | 'scale' | 'rotate' | 'skew';
	'move-x'?: string;
	'move-y'?: string;
	'move-z'?: string;
	scale?: string;
	'rotate-x'?: string;
	'rotate-y'?: string;
	'rotate-z'?: string;
	'skew-x'?: string;
	'skew-y'?: string;
	isVisible: boolean;
};

export type WpTransformPreset = {
	slug: string;
	name: string;
	items: TransformPresetItem[];
};

const DEFAULT_ITEM: TransformPresetItem = {
	type: 'move',
	'move-x': '0px',
	'move-y': '0px',
	'move-z': '0px',
	isVisible: true,
};

/**
 * Normalizes one row to the minimal shape stored in theme.json (type-specific fields only).
 * Stale keys from another `type` are ignored because we only read fields for the resolved type.
 */
function sanitizeItem(raw: Record<string, unknown>): TransformPresetItem {
	const typeRaw = String(raw.type ?? DEFAULT_ITEM.type).trim();
	const isVisible = Boolean(raw.isVisible ?? true);
	const type =
		typeRaw === 'scale' || typeRaw === 'rotate' || typeRaw === 'skew'
			? typeRaw
			: 'move';

	if (type === 'move') {
		return {
			isVisible,
			type: 'move',
			'move-x': String(raw['move-x'] ?? DEFAULT_ITEM['move-x']).trim(),
			'move-y': String(raw['move-y'] ?? DEFAULT_ITEM['move-y']).trim(),
			'move-z': String(raw['move-z'] ?? DEFAULT_ITEM['move-z']).trim(),
		};
	}

	if (type === 'scale') {
		return {
			isVisible,
			type: 'scale',
			scale: String(raw.scale ?? '100%').trim(),
		};
	}

	if (type === 'rotate') {
		return {
			isVisible,
			type: 'rotate',
			'rotate-x': String(raw['rotate-x'] ?? '0deg').trim(),
			'rotate-y': String(raw['rotate-y'] ?? '0deg').trim(),
			'rotate-z': String(raw['rotate-z'] ?? '0deg').trim(),
		};
	}

	return {
		isVisible,
		type: 'skew',
		'skew-x': String(raw['skew-x'] ?? '0deg').trim(),
		'skew-y': String(raw['skew-y'] ?? '0deg').trim(),
	};
}

export function sanitizeTransformPresets(raw: unknown): WpTransformPreset[] {
	if (!Array.isArray(raw)) {
		return [];
	}
	return raw
		.filter(
			(p): p is Record<string, unknown> =>
				p !== null && typeof p === 'object'
		)
		.map((p) => {
			let items: TransformPresetItem[] = [];
			if (Array.isArray(p.items)) {
				items = p.items
					.filter((row) => row !== null && typeof row === 'object')
					.map((row) => sanitizeItem(row as Record<string, unknown>));
			}
			if (!items.length) {
				items = [{ ...DEFAULT_ITEM }];
			}
			return {
				slug: String(p.slug ?? '').trim(),
				name: String(p.name ?? '').trim(),
				items,
				isVisible: Boolean(p.isVisible ?? true),
			};
		})
		.filter((p) => p.slug && p.name);
}

/**
 * Maps stored `items` into the repeater record shape TransformControl expects.
 * Keys use `${type}-${index}` so repeated types (e.g. two `move` rows) stay distinct and
 * align with `getSortedRepeater`’s `order` field when round-tripping (same idea as transition presets).
 */
export function itemsToRepeaterRecord(
	items: TransformPresetItem[]
): Record<string, TransformPresetItem & { isVisible: boolean; order: number }> {
	const list = items?.length ? items : [{ ...DEFAULT_ITEM }];
	const out: Record<
		string,
		TransformPresetItem & { isVisible: boolean; order: number }
	> = {};
	list.forEach((item, i) => {
		const key = `${item.type}-${i}`;
		out[key] = {
			...item,
			isVisible: true,
			order: i,
		};
	});
	return out;
}

function rowToItem(row: Record<string, unknown>): TransformPresetItem {
	return sanitizeItem(row);
}

/** Strips repeater metadata; order comes from getSortedRepeater (repeater `order` field). */
export function repeaterRecordToItems(
	repeater: Record<string, Record<string, unknown>>
): TransformPresetItem[] {
	const sorted = getSortedRepeater(repeater);
	return sorted.map(([, row]) => rowToItem(row));
}
