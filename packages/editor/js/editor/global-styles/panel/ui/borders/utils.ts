/**
 * Blockera dependencies
 */
import { getValueAddonRealValue, isValid } from '@blockera/controls';

/**
 * Box border preset value shape (Blockera `BoxBorderControl`).
 */
export type BoxBorderValue = {
	type: 'all' | 'custom';
	all?: {
		width: string;
		style: string;
		color: string;
	};
	left?: {
		width: string;
		style: string;
		color: string;
	};
	right?: {
		width: string;
		style: string;
		color: string;
	};
	top?: {
		width: string;
		style: string;
		color: string;
	};
	bottom?: {
		width: string;
		style: string;
		color: string;
	};
};

export type BorderBoxPreset = {
	slug: string;
	name: string;
	border: BoxBorderValue;
};

/**
 * Only `settings.custom.blockera` keys we persist (unknown keys ignored elsewhere).
 */
export const BLOCKERA_CUSTOM_BORDER_KEY = 'borderPresets' as const;

function emptySide() {
	return { width: '', style: '', color: '' };
}

export function getDefaultBoxBorderValue(): BoxBorderValue {
	return {
		type: 'all',
		all: emptySide(),
		left: emptySide(),
		right: emptySide(),
		top: emptySide(),
		bottom: emptySide(),
	};
}

function isBoxSide(
	o: unknown
): o is { width: string; style: string; color: string } {
	if (!o || typeof o !== 'object') {
		return false;
	}
	const x = o as Record<string, unknown>;
	return (
		typeof x.width === 'string' &&
		typeof x.style === 'string' &&
		typeof x.color === 'string'
	);
}

function normalizeBorderValue(raw: unknown): BoxBorderValue {
	if (isValidBoxBorderValue(raw)) {
		return raw;
	}
	return getDefaultBoxBorderValue();
}

function isValidBoxBorderValue(val: unknown): val is BoxBorderValue {
	if (!val || typeof val !== 'object') {
		return false;
	}
	const b = val as Record<string, unknown>;
	if (b.type !== 'all' && b.type !== 'custom') {
		return false;
	}
	if (b.type === 'all') {
		return !b.all || isBoxSide(b.all);
	}
	return (
		(!b.top || isBoxSide(b.top)) &&
		(!b.right || isBoxSide(b.right)) &&
		(!b.bottom || isBoxSide(b.bottom)) &&
		(!b.left || isBoxSide(b.left))
	);
}

/**
 * Keep border box presets: requires slug and name; border is normalized or defaulted.
 */
export function sanitizeBorderBoxPresets(presets: unknown): BorderBoxPreset[] {
	if (!Array.isArray(presets)) {
		return [];
	}
	const out: BorderBoxPreset[] = [];
	for (const item of presets) {
		if (!item || typeof item !== 'object') {
			continue;
		}
		const o = item as Record<string, unknown>;
		if (typeof o.slug !== 'string' || typeof o.name !== 'string') {
			continue;
		}
		out.push({
			slug: o.slug,
			name: o.name,
			border: normalizeBorderValue(o.border),
		});
	}
	return out;
}

/**
 * Resolved CSS color string for labels (supports value-addons).
 */
export function resolveBorderColorString(
	color: string | Record<string, unknown> | undefined
): string {
	if (color === undefined || color === '') {
		return '';
	}
	if (typeof color === 'string') {
		return color;
	}
	if (isValid(color)) {
		return String(getValueAddonRealValue(color) ?? '');
	}
	return '';
}

/** T / R / B / L — compact per-side cues for border opener (no arrow glyphs). */
export const BORDER_SIDE_LABELS_SHORT = ['T', 'R', 'B', 'L'] as const;

function sideDataEqual(
	a: BoxBorderValue['top'],
	b: BoxBorderValue['top']
): boolean {
	if (!a || !b) {
		return false;
	}
	return (
		String(a.width ?? '').trim() === String(b.width ?? '').trim() &&
		String(a.style ?? '').trim() === String(b.style ?? '').trim() &&
		resolveBorderColorString(
			a.color as string | Record<string, unknown> | undefined
		) ===
			resolveBorderColorString(
				b.color as string | Record<string, unknown> | undefined
			)
	);
}

/**
 * Plain-language summary for `title` / tooltips (includes full color text).
 */
export function getBorderPresetAccessibilityDescription(
	border: BoxBorderValue | undefined
): string {
	if (!border) {
		return '';
	}

	if (border.type === 'all' && border.all) {
		const { width, style, color } = border.all;
		const parts: string[] = [];
		const w = String(width ?? '').trim();
		const st = String(style ?? '').trim();
		const c = resolveBorderColorString(
			color as string | Record<string, unknown> | undefined
		);
		if (w) {
			parts.push(w);
		}
		if (st) {
			parts.push(st);
		}
		if (c) {
			parts.push(c);
		}
		return parts.join(' · ');
	}

	if (border.type === 'custom') {
		const keys = ['top', 'right', 'bottom', 'left'] as const;
		const labels = ['top', 'right', 'bottom', 'left'];
		const parts: string[] = [];
		for (let i = 0; i < keys.length; i++) {
			const side = border[keys[i]];
			if (!side) {
				continue;
			}
			const w = String(side.width ?? '').trim();
			const st = String(side.style ?? '').trim();
			const c = resolveBorderColorString(
				side.color as string | Record<string, unknown> | undefined
			);
			const bits: string[] = [];
			if (w) {
				bits.push(w);
			}
			if (st) {
				bits.push(st);
			}
			if (c) {
				bits.push(c);
			}
			if (bits.length) {
				parts.push(`${labels[i]}: ${bits.join(' ')}`);
			}
		}
		return parts.join('; ');
	}

	return '';
}

export function areAllFourCustomSidesEqual(border: BoxBorderValue): boolean {
	if (border.type !== 'custom') {
		return false;
	}
	const t = border.top;
	const r = border.right;
	const b = border.bottom;
	const l = border.left;
	if (!t || !r || !b || !l) {
		return false;
	}
	return sideDataEqual(t, r) && sideDataEqual(r, b) && sideDataEqual(b, l);
}

export function areCustomSidesTbLrPairs(
	border: BoxBorderValue
): [BoxBorderValue['top'], BoxBorderValue['left']] | null {
	if (border.type !== 'custom') {
		return null;
	}
	const t = border.top;
	const r = border.right;
	const b = border.bottom;
	const l = border.left;
	if (!t || !r || !b || !l) {
		return null;
	}
	if (sideDataEqual(t, b) && sideDataEqual(l, r) && !sideDataEqual(t, l)) {
		return [t, l];
	}
	return null;
}
