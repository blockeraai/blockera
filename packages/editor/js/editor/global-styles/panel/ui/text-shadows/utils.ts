/**
 * WordPress theme.json text shadow preset (settings.textShadow.presets).
 * Each preset stores `items`: rows matching TextShadowControl (x, y, blur, color, isVisible).
 */
import { getSortedRepeater } from '@blockera/controls';
import {
	parseCssTextShadowToRepeaterValue,
	formatRepeaterItemsToCssTextShadow,
} from '../../../../../extensions/libs/border-and-shadow/compatibilities/text-shadow-css.js';

export type TextShadowPresetItem = {
	x: string;
	y: string;
	blur: string;
	color: string;
	isVisible: boolean;
};

export type WpTextShadowPreset = {
	slug: string;
	name: string;
	items: TextShadowPresetItem[];
};

/** Matches `defaultRepeaterItemValue` in `packages/controls/js/libs/text-shadow-control/index.js`. */
export const DEFAULT_TEXT_SHADOW_ITEM: TextShadowPresetItem = {
	x: '1px',
	y: '1px',
	blur: '1px',
	color: '#000000ab',
	isVisible: true,
};

function sanitizeTextShadowItem(
	raw: Record<string, unknown>
): TextShadowPresetItem {
	return {
		x: String(raw.x ?? '0px').trim() || '0px',
		y: String(raw.y ?? '0px').trim() || '0px',
		blur: String(raw.blur ?? '0px').trim() || '0px',
		color: String(raw.color ?? '#000000ab').trim() || '#000000ab',
		isVisible: Boolean(raw.isVisible ?? true),
	};
}

function itemsFromLegacyCss(css: string): TextShadowPresetItem[] {
	const record = parseCssTextShadowToRepeaterValue(css) as Record<
		string,
		Record<string, unknown>
	>;
	return repeaterRecordToTextShadowItems(record);
}

function textShadowItemsFromRaw(
	p: Record<string, unknown>
): TextShadowPresetItem[] {
	if (Array.isArray(p.items) && p.items.length) {
		const first = p.items[0];
		if (
			first !== null &&
			typeof first === 'object' &&
			!Array.isArray(first)
		) {
			return p.items
				.filter((row) => row !== null && typeof row === 'object')
				.map((row) =>
					sanitizeTextShadowItem(row as Record<string, unknown>)
				);
		}
		if (typeof first === 'string') {
			const joined = (p.items as string[])
				.map((s) => String(s).trim())
				.filter(Boolean)
				.join(', ');
			if (joined) {
				return itemsFromLegacyCss(joined);
			}
		}
	}
	const legacy = String(p.shadow ?? '').trim();
	if (legacy) {
		return itemsFromLegacyCss(legacy);
	}
	return [{ ...DEFAULT_TEXT_SHADOW_ITEM }];
}

/**
 * Maps stored `items` into the repeater record shape TextShadowControl uses (`"0"`, `"1"`, … + `order`).
 */
export function textShadowItemsToRepeaterRecord(
	items: TextShadowPresetItem[]
): Record<string, TextShadowPresetItem & { order: number }> {
	const list = items?.length ? items : [{ ...DEFAULT_TEXT_SHADOW_ITEM }];
	const out: Record<string, TextShadowPresetItem & { order: number }> = {};

	list.forEach((item, i) => {
		const clean = sanitizeTextShadowItem(
			item as unknown as Record<string, unknown>
		);
		out[String(i)] = {
			...clean,
			isVisible: clean.isVisible !== false,
			order: i,
		};
	});

	return out;
}

export function repeaterRecordToTextShadowItems(
	repeater: Record<string, Record<string, unknown>>
): TextShadowPresetItem[] {
	const sorted = getSortedRepeater(repeater);
	return sorted.map(([, row]) =>
		sanitizeTextShadowItem(row as Record<string, unknown>)
	);
}

export function textShadowPresetItemsToCss(
	items: TextShadowPresetItem[] | undefined
): string {
	if (!items?.length) {
		return '';
	}
	return formatRepeaterItemsToCssTextShadow(items);
}

export function sanitizeTextShadowPresets(raw: unknown): WpTextShadowPreset[] {
	if (!Array.isArray(raw)) {
		return [];
	}
	return raw
		.filter(
			(p): p is Record<string, unknown> =>
				p !== null && typeof p === 'object'
		)
		.map((p) => ({
			slug: String(p.slug ?? '').trim(),
			name: String(p.name ?? '').trim(),
			items: textShadowItemsFromRaw(p),
		}))
		.filter((p) => p.slug && p.name);
}

export function truncateTextShadowCssForHeader(
	css: string,
	maxLen = 40
): string {
	const s = String(css ?? '').trim();
	if (!s) {
		return '';
	}
	if (s.length <= maxLen) {
		return s;
	}
	return `${s.slice(0, Math.max(0, maxLen - 1))}…`;
}

export function getTextShadowPresetAccessibilityDescription(
	preset: WpTextShadowPreset | undefined
): string {
	if (!preset) {
		return '';
	}
	const parts: string[] = [];
	if (preset.name) {
		parts.push(preset.name);
	}
	const css = textShadowPresetItemsToCss(preset.items);
	if (css) {
		parts.push(css);
	}
	return parts.join(' — ');
}
