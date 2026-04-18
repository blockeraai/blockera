/**
 * WordPress theme.json shadow preset (settings.shadow.presets).
 * Canonical shape matches core: `{ slug, name, shadow }` where `shadow` is the
 * CSS `box-shadow` value. Legacy presets may use `items` (repeater rows) or a
 * string `shadow`; both are read and normalized to CSS for the UI.
 */
import { getSortedRepeater } from '@blockera/controls';
import {
	parseCssBoxShadowToRepeaterValue,
	formatControlItemsToCssBoxShadow,
} from './shadow-preset-css';

export type ShadowPresetItem = {
	type: 'inner' | 'outer';
	x: string;
	y: string;
	blur: string;
	spread: string;
	color: string;
	isVisible: boolean;
};

export type WpShadowPreset = {
	slug: string;
	name: string;
	shadow: string;
	isVisible: boolean;
};

/** Matches `defaultRepeaterItemValue` in `packages/controls/js/libs/box-shadow-control/index.js`. */
export const DEFAULT_SHADOW_ITEM: ShadowPresetItem = {
	type: 'outer',
	x: '10px',
	y: '10px',
	blur: '10px',
	spread: '0px',
	color: '#000000ab',
	isVisible: true,
};

function sanitizeShadowItem(raw: Record<string, unknown>): ShadowPresetItem {
	const t = raw.type === 'inner' ? 'inner' : 'outer';
	return {
		type: t,
		x: String(raw.x ?? '0px').trim() || '0px',
		y: String(raw.y ?? '0px').trim() || '0px',
		blur: String(raw.blur ?? '0px').trim() || '0px',
		spread: String(raw.spread ?? '0px').trim() || '0px',
		color: String(raw.color ?? '#000000ab').trim() || '#000000ab',
		isVisible: Boolean(raw.isVisible ?? true),
	};
}

function itemsFromLegacyCss(css: string): ShadowPresetItem[] {
	const record = parseCssBoxShadowToRepeaterValue(css) as Record<
		string,
		Record<string, unknown>
	>;
	return repeaterRecordToShadowItems(record);
}

export function shadowItemsFromRaw(
	p: Record<string, unknown>
): ShadowPresetItem[] {
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
					sanitizeShadowItem(row as Record<string, unknown>)
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
	return [{ ...DEFAULT_SHADOW_ITEM }];
}

/**
 * Maps stored `items` into the repeater record shape BoxShadowControl expects
 * (keys `outer-0`, `inner-1`, … + `order`).
 */
export function shadowItemsToRepeaterRecord(
	items: ShadowPresetItem[]
): Record<string, ShadowPresetItem & { order: number }> {
	const list = items?.length ? items : [{ ...DEFAULT_SHADOW_ITEM }];
	const out: Record<string, ShadowPresetItem & { order: number }> = {};
	const typeCounts = { outer: 0, inner: 0 };

	list.forEach((item, i) => {
		const clean = sanitizeShadowItem(
			item as unknown as Record<string, unknown>
		);
		const t = clean.type === 'inner' ? 'inner' : 'outer';
		const idx = typeCounts[t]++;
		const key = `${t}-${idx}`;
		out[key] = {
			...clean,
			type: t,
			isVisible: clean.isVisible !== false,
			order: i,
		};
	});

	return out;
}

/** Strips repeater metadata; order comes from getSortedRepeater. */
export function repeaterRecordToShadowItems(
	repeater: Record<string, Record<string, unknown>>
): ShadowPresetItem[] {
	const sorted = getSortedRepeater(repeater);
	return sorted.map(([, row]) =>
		sanitizeShadowItem(row as Record<string, unknown>)
	);
}

export function shadowPresetItemsToCss(
	items: ShadowPresetItem[] | undefined
): string {
	if (!items?.length) {
		return '';
	}
	return formatControlItemsToCssBoxShadow(items);
}

/**
 * Resolved CSS for a preset (prefers stored `shadow` string, else layers from `items` / legacy).
 */
export function shadowCssFromPreset(
	preset: Record<string, unknown> | WpShadowPreset
): string {
	const p = preset as Record<string, unknown>;
	const direct = String(p.shadow ?? '').trim();
	if (direct) {
		return direct;
	}
	return shadowPresetItemsToCss(shadowItemsFromRaw(p));
}

export function sanitizeShadowPresets(raw: unknown): WpShadowPreset[] {
	if (!Array.isArray(raw)) {
		return [];
	}
	return raw
		.filter(
			(p): p is Record<string, unknown> =>
				p !== null && typeof p === 'object'
		)
		.map((p) => {
			const slug = String(p.slug ?? '').trim();
			const name = String(p.name ?? '').trim();
			if (!slug || !name) {
				return null;
			}
			const shadow = shadowCssFromPreset(p);
			return {
				slug,
				name,
				shadow,
				isVisible: Boolean(p.isVisible ?? true),
			};
		})
		.filter((p): p is WpShadowPreset => p !== null);
}

export function truncateShadowCssForHeader(css: string, maxLen = 40): string {
	const s = String(css ?? '').trim();
	if (!s) {
		return '';
	}
	if (s.length <= maxLen) {
		return s;
	}
	return `${s.slice(0, Math.max(0, maxLen - 1))}…`;
}

export function getShadowPresetAccessibilityDescription(
	preset: WpShadowPreset | undefined
): string {
	if (!preset) {
		return '';
	}
	const parts: string[] = [];
	if (preset.name) {
		parts.push(preset.name);
	}
	const css = shadowCssFromPreset(
		preset as unknown as Record<string, unknown>
	);
	if (css) {
		parts.push(css);
	}
	return parts.join(' — ');
}
