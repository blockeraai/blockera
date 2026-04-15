/**
 * Blockera theme.json text shadow preset (settings.textShadow.presets).
 * Stored like core shadow presets: `{ slug, name, shadow }` with CSS `text-shadow`.
 * Legacy presets may use `items` repeater rows; both are accepted when reading.
 */
import {
	getSortedRepeater,
	parseCssTextShadowToRepeaterValue,
	formatRepeaterItemsToCssTextShadow,
} from '@blockera/controls';

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
	shadow: string;
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

export function textShadowItemsFromRaw(
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

/**
 * Resolved CSS for a preset (prefers stored `shadow` string, else layers from `items` / legacy).
 */
export function textShadowCssFromPreset(
	preset: Record<string, unknown> | WpTextShadowPreset
): string {
	const p = preset as Record<string, unknown>;
	const direct = String(p.shadow ?? '').trim();
	if (direct) {
		return direct;
	}
	return textShadowPresetItemsToCss(textShadowItemsFromRaw(p));
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
		.map((p) => {
			const slug = String(p.slug ?? '').trim();
			const name = String(p.name ?? '').trim();
			if (!slug || !name) {
				return null;
			}
			const shadow = textShadowCssFromPreset(p);
			return { slug, name, shadow };
		})
		.filter((p): p is WpTextShadowPreset => p !== null);
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
	const css = textShadowCssFromPreset(
		preset as unknown as Record<string, unknown>
	);
	if (css) {
		parts.push(css);
	}
	return parts.join(' — ');
}
