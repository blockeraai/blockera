/**
 * theme.json filter preset (settings.filter.presets).
 * Each preset stores `items`: filter rows matching FilterControl repeater fields.
 */
import { getSortedRepeater } from '@blockera/controls';
import { withPresetMetaFromRepeaterRow } from '../components/preset-meta-utils';

export type FilterType =
	| 'blur'
	| 'drop-shadow'
	| 'brightness'
	| 'contrast'
	| 'hue-rotate'
	| 'saturate'
	| 'grayscale'
	| 'invert'
	| 'sepia';

/** Minimal row shape per type; extra keys are stripped in sanitizeItem. */
export type FilterPresetItem = {
	type: FilterType;
	isVisible: boolean;
	blur?: string;
	brightness?: string;
	contrast?: string;
	'hue-rotate'?: string;
	saturate?: string;
	grayscale?: string;
	invert?: string;
	sepia?: string;
	'drop-shadow-x'?: string;
	'drop-shadow-y'?: string;
	'drop-shadow-blur'?: string;
	'drop-shadow-color'?: string;
};

export type WpFilterPreset = {
	slug: string;
	name: string;
	items: FilterPresetItem[];
};

const DEFAULT_ITEM: FilterPresetItem = {
	type: 'blur',
	blur: '3px',
	isVisible: true,
};

const VALID_TYPES: FilterType[] = [
	'blur',
	'drop-shadow',
	'brightness',
	'contrast',
	'hue-rotate',
	'saturate',
	'grayscale',
	'invert',
	'sepia',
];

function resolveType(raw: string): FilterType {
	const t = raw.trim();
	return VALID_TYPES.includes(t as FilterType) ? (t as FilterType) : 'blur';
}

function sanitizeItem(raw: Record<string, unknown>): FilterPresetItem {
	const type = resolveType(String(raw.type ?? DEFAULT_ITEM.type));

	if (type === 'blur') {
		return {
			type: 'blur',
			blur: String(raw.blur ?? DEFAULT_ITEM.blur).trim(),
			isVisible: Boolean(raw.isVisible ?? true),
		};
	}

	if (type === 'drop-shadow') {
		return {
			type: 'drop-shadow',
			'drop-shadow-x': String(raw['drop-shadow-x'] ?? '10px').trim(),
			'drop-shadow-y': String(raw['drop-shadow-y'] ?? '10px').trim(),
			'drop-shadow-blur': String(
				raw['drop-shadow-blur'] ?? '10px'
			).trim(),
			'drop-shadow-color': String(raw['drop-shadow-color'] ?? '').trim(),
			isVisible: Boolean(raw.isVisible ?? true),
		};
	}

	if (type === 'brightness') {
		return {
			type: 'brightness',
			brightness: String(raw.brightness ?? '200%').trim(),
			isVisible: Boolean(raw.isVisible ?? true),
		};
	}

	if (type === 'contrast') {
		return {
			type: 'contrast',
			contrast: String(raw.contrast ?? '200%').trim(),
			isVisible: Boolean(raw.isVisible ?? true),
		};
	}

	if (type === 'hue-rotate') {
		return {
			type: 'hue-rotate',
			'hue-rotate': String(raw['hue-rotate'] ?? '45deg').trim(),
			isVisible: Boolean(raw.isVisible ?? true),
		};
	}

	if (type === 'saturate') {
		return {
			type: 'saturate',
			saturate: String(raw.saturate ?? '200%').trim(),
			isVisible: Boolean(raw.isVisible ?? true),
		};
	}

	if (type === 'grayscale') {
		return {
			type: 'grayscale',
			grayscale: String(raw.grayscale ?? '100%').trim(),
			isVisible: Boolean(raw.isVisible ?? true),
		};
	}

	if (type === 'invert') {
		return {
			type: 'invert',
			invert: String(raw.invert ?? '100%').trim(),
			isVisible: Boolean(raw.isVisible ?? true),
		};
	}

	return {
		type: 'sepia',
		sepia: String(raw.sepia ?? '100%').trim(),
		isVisible: Boolean(raw.isVisible ?? true),
	};
}

export function sanitizeFilterPresets(raw: unknown): WpFilterPreset[] {
	if (!Array.isArray(raw)) {
		return [];
	}
	return raw
		.filter(
			(p): p is Record<string, unknown> =>
				p !== null && typeof p === 'object'
		)
		.map((p) => {
			let items: FilterPresetItem[] = [];
			if (Array.isArray(p.items)) {
				items = p.items
					.filter((row) => row !== null && typeof row === 'object')
					.map((row) => sanitizeItem(row as Record<string, unknown>));
			}
			if (!items.length) {
				items = [{ ...DEFAULT_ITEM }];
			}
			return withPresetMetaFromRepeaterRow(p, {
				slug: String(p.slug ?? '').trim(),
				name: String(p.name ?? '').trim(),
				items,
				isVisible: Boolean(p.isVisible ?? true),
			});
		})
		.filter((p) => p.slug && p.name);
}

/**
 * Maps theme.json `items` to the repeater record FilterControl expects.
 * Keys use `${type}-${index}` so duplicate types in one preset (e.g. two blur rows)
 * stay distinct and stay aligned with getSortedRepeater’s `order` when round-tripping.
 */
export function itemsToRepeaterRecord(
	items: FilterPresetItem[]
): Record<string, FilterPresetItem & { isVisible: boolean; order: number }> {
	const list = items?.length ? items : [{ ...DEFAULT_ITEM }];
	const out: Record<
		string,
		FilterPresetItem & { isVisible: boolean; order: number }
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

export function repeaterRecordToItems(
	repeater: Record<string, Record<string, unknown>>
): FilterPresetItem[] {
	const sorted = getSortedRepeater(repeater);
	return sorted.map(([, row]) => sanitizeItem(row));
}
