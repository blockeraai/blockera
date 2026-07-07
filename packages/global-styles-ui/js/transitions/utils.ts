/**
 * WordPress theme.json transition preset (settings.transition.presets).
 * Each preset stores `items`: transition rows matching TransitionControl repeater fields
 * (type, duration, timing, delay) — same semantics as block attributes blockeraTransition.
 */
import { getSortedRepeater } from '@blockera/controls';
import { withPresetMetaFromRepeaterRow } from '../components/preset-meta-utils';

export type TransitionPresetItem = {
	type: string;
	duration: string;
	timing: string;
	delay: string;
	isVisible: boolean;
};

export type WpTransitionPreset = {
	slug: string;
	name: string;
	items: TransitionPresetItem[];
};

const DEFAULT_ITEM: TransitionPresetItem = {
	type: 'all',
	duration: '500ms',
	timing: 'ease',
	delay: '0ms',
	isVisible: true,
};

function sanitizeItem(raw: Record<string, unknown>): TransitionPresetItem {
	return {
		isVisible: Boolean(raw.isVisible ?? true),
		type: String(raw.type ?? DEFAULT_ITEM.type).trim() || DEFAULT_ITEM.type,
		duration: String(raw.duration ?? DEFAULT_ITEM.duration).trim(),
		timing: String(raw.timing ?? DEFAULT_ITEM.timing).trim(),
		delay: String(raw.delay ?? DEFAULT_ITEM.delay).trim(),
	};
}

export function sanitizeTransitionPresets(raw: unknown): WpTransitionPreset[] {
	if (!Array.isArray(raw)) {
		return [];
	}
	return raw
		.filter(
			(p): p is Record<string, unknown> =>
				p !== null && typeof p === 'object'
		)
		.map((p) => {
			let items: TransitionPresetItem[] = [];
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
 * Maps stored `items` into the object shape TransitionControl / RepeaterControl expect.
 * Keys use `${type}-${index}` so repeated property types (e.g. two `all` rows) stay distinct
 * and align with getSortedRepeater’s `order` field when round-tripping.
 */
export function itemsToRepeaterRecord(
	items: TransitionPresetItem[]
): Record<
	string,
	TransitionPresetItem & { isVisible: boolean; order: number }
> {
	const list = items?.length ? items : [{ ...DEFAULT_ITEM }];
	const out: Record<
		string,
		TransitionPresetItem & { isVisible: boolean; order: number }
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

/** Strips repeater metadata; order comes from getSortedRepeater (repeater `order` field). */
export function repeaterRecordToItems(
	repeater: Record<string, Record<string, unknown>>
): TransitionPresetItem[] {
	const sorted = getSortedRepeater(repeater);
	return sorted.map(([, row]) => ({
		type: String(row?.type ?? DEFAULT_ITEM.type),
		duration: String(row?.duration ?? DEFAULT_ITEM.duration),
		timing: String(row?.timing ?? DEFAULT_ITEM.timing),
		delay: String(row?.delay ?? DEFAULT_ITEM.delay),
	}));
}
