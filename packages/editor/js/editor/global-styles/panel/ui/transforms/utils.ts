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
};

/**
 * Normalizes one row to the minimal shape stored in theme.json (type-specific fields only).
 * Stale keys from another `type` are ignored because we only read fields for the resolved type.
 */
function sanitizeItem(raw: Record<string, unknown>): TransformPresetItem {
	const typeRaw = String(raw.type ?? DEFAULT_ITEM.type).trim();
	const type =
		typeRaw === 'scale' || typeRaw === 'rotate' || typeRaw === 'skew'
			? typeRaw
			: 'move';

	if (type === 'move') {
		return {
			type: 'move',
			'move-x': String(raw['move-x'] ?? DEFAULT_ITEM['move-x']).trim(),
			'move-y': String(raw['move-y'] ?? DEFAULT_ITEM['move-y']).trim(),
			'move-z': String(raw['move-z'] ?? DEFAULT_ITEM['move-z']).trim(),
		};
	}

	if (type === 'scale') {
		return {
			type: 'scale',
			scale: String(raw.scale ?? '100%').trim(),
		};
	}

	if (type === 'rotate') {
		return {
			type: 'rotate',
			'rotate-x': String(raw['rotate-x'] ?? '0deg').trim(),
			'rotate-y': String(raw['rotate-y'] ?? '0deg').trim(),
			'rotate-z': String(raw['rotate-z'] ?? '0deg').trim(),
		};
	}

	return {
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

export function formatPresetItemsSummary(
	items: TransformPresetItem[] | undefined
): string {
	if (!items?.length) {
		return '';
	}
	const first = items[0];
	const rest = items.length > 1 ? ` (+${items.length - 1})` : '';

	switch (first.type) {
		case 'move':
			return `${first['move-x']} · ${first['move-y']} · ${first['move-z']}${rest}`;
		case 'scale':
			return `${first.scale ?? '100%'}${rest}`;
		case 'rotate':
			return `${first['rotate-x']} · ${first['rotate-y']} · ${first['rotate-z']}${rest}`;
		case 'skew':
			return `${first['skew-x']} · ${first['skew-y']}${rest}`;
		default:
			return rest ? `(${items.length})` : '';
	}
}

export function getTransformPresetAccessibilityDescription(
	preset:
		| {
				name?: string;
				items?: TransformPresetItem[];
		  }
		| undefined
): string {
	if (!preset) {
		return '';
	}
	const parts: string[] = [];
	if (preset.name) {
		parts.push(preset.name);
	}
	const summary = formatPresetItemsSummary(preset.items);
	if (summary) {
		parts.push(summary);
	}
	return parts.join(' — ');
}
