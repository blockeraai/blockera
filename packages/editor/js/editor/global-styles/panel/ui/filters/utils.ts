/**
 * theme.json filter preset (settings.filter.presets).
 * Each preset stores `items`: filter rows matching FilterControl repeater fields.
 */
import { __ } from '@wordpress/i18n';

import { getSortedRepeater } from '@blockera/controls';

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
		};
	}

	if (type === 'brightness') {
		return {
			type: 'brightness',
			brightness: String(raw.brightness ?? '200%').trim(),
		};
	}

	if (type === 'contrast') {
		return {
			type: 'contrast',
			contrast: String(raw.contrast ?? '200%').trim(),
		};
	}

	if (type === 'hue-rotate') {
		return {
			type: 'hue-rotate',
			'hue-rotate': String(raw['hue-rotate'] ?? '45deg').trim(),
		};
	}

	if (type === 'saturate') {
		return {
			type: 'saturate',
			saturate: String(raw.saturate ?? '200%').trim(),
		};
	}

	if (type === 'grayscale') {
		return {
			type: 'grayscale',
			grayscale: String(raw.grayscale ?? '100%').trim(),
		};
	}

	if (type === 'invert') {
		return {
			type: 'invert',
			invert: String(raw.invert ?? '100%').trim(),
		};
	}

	return {
		type: 'sepia',
		sepia: String(raw.sepia ?? '100%').trim(),
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
			return {
				slug: String(p.slug ?? '').trim(),
				name: String(p.name ?? '').trim(),
				items,
			};
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

export function getFilterTypeLabel(type: string): string {
	switch (type) {
		case 'blur':
			return __('Blur', 'blockera');
		case 'drop-shadow':
			return __('Drop Shadow', 'blockera');
		case 'brightness':
			return __('Brightness', 'blockera');
		case 'contrast':
			return __('Contrast', 'blockera');
		case 'hue-rotate':
			return __('Hue Rotate', 'blockera');
		case 'saturate':
			return __('Saturation', 'blockera');
		case 'grayscale':
			return __('Grayscale', 'blockera');
		case 'invert':
			return __('Invert', 'blockera');
		case 'sepia':
			return __('Sepia', 'blockera');
		default:
			return type;
	}
}

export function formatPresetItemsSummary(
	items: FilterPresetItem[] | undefined
): string {
	if (!items?.length) {
		return '';
	}
	const first = items[0];
	const rest = items.length > 1 ? ` (+${items.length - 1})` : '';

	switch (first.type) {
		case 'blur':
			return `${getFilterTypeLabel('blur')} · ${first.blur ?? '3px'}${rest}`;
		case 'drop-shadow':
			return `${getFilterTypeLabel('drop-shadow')} · ${first['drop-shadow-x'] ?? ''} ${first['drop-shadow-y'] ?? ''}${rest}`;
		case 'brightness':
			return `${getFilterTypeLabel('brightness')} · ${first.brightness ?? ''}${rest}`;
		case 'contrast':
			return `${getFilterTypeLabel('contrast')} · ${first.contrast ?? ''}${rest}`;
		case 'hue-rotate':
			return `${getFilterTypeLabel('hue-rotate')} · ${first['hue-rotate'] ?? ''}${rest}`;
		case 'saturate':
			return `${getFilterTypeLabel('saturate')} · ${first.saturate ?? ''}${rest}`;
		case 'grayscale':
			return `${getFilterTypeLabel('grayscale')} · ${first.grayscale ?? ''}${rest}`;
		case 'invert':
			return `${getFilterTypeLabel('invert')} · ${first.invert ?? ''}${rest}`;
		case 'sepia':
			return `${getFilterTypeLabel('sepia')} · ${first.sepia ?? ''}${rest}`;
		default:
			return rest ? `(${items.length})` : '';
	}
}

export function getFilterPresetAccessibilityDescription(
	preset:
		| {
				name?: string;
				items?: FilterPresetItem[];
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
