/**
 * Builds the `site-tokens.json` payload (used by the Blockera AI HTML/CSS site
 * generator) from the merged WordPress + Blockera global styles of the current
 * site. The shape mirrors `structures/site/tokens.json` in the AI generator
 * project: a top-level `layout` block plus a fixed set of token `categories`,
 * each as a flat `{ tokenId: cssValueString }` map.
 *
 * Preset reading is anchored at `__experimentalFeatures` (already merged by
 * core: theme.json defaults + theme + user). Blockera-only presets live under
 * `__experimentalFeatures.blockera*` flat keys.
 * `blockGap` is resolved separately via `styles.spacing.blockGap` and its preset
 * reference is dereferenced against the spacing-size map we just built.
 */
import { getBlockeraExperimentalFeatures } from '@blockera/data';

type StringMap = { [key: string]: string };

type LayeredPresets<T> =
	| T[]
	| {
			default?: T[];
			theme?: T[];
			custom?: T[];
	  }
	| undefined
	| null;

export type SiteTokensExport = {
	layout: { elementsGap?: string };
	categories: {
		color: StringMap;
		spacing: StringMap;
		'width-size': StringMap;
		'font-family': StringMap;
		'font-size': StringMap;
		'border-radius': StringMap;
		'box-shadow': StringMap;
		'border-line': StringMap;
		'text-shadow': StringMap;
		transforms: StringMap;
		filter: StringMap;
		'backdrop-filter': StringMap;
		transition: StringMap;
	};
};

/**
 * Flatten only {theme, custom} layers (exclude editor defaults).
 * This matches “current site tokens” semantics: theme.json + user edits.
 */
function flattenThemeCustomLayers<T>(presets: LayeredPresets<T>): T[] {
	if (!presets) {
		return [];
	}
	if (Array.isArray(presets)) {
		return presets;
	}
	const out: T[] = [];
	if (Array.isArray(presets.theme)) {
		for (const p of presets.theme) {
			out.push(p);
		}
	}
	if (Array.isArray(presets.custom)) {
		for (const p of presets.custom) {
			out.push(p);
		}
	}
	return out;
}

/**
 * Insert into a category map only when both id and value are non-empty
 * strings (later layers overwrite earlier ones — that's intentional, custom
 * should win over theme should win over default).
 */
function pushString(map: StringMap, id: unknown, value: unknown): void {
	if (typeof id !== 'string') {
		return;
	}
	const slug = id.trim();
	if (!slug) {
		return;
	}
	if (typeof value !== 'string') {
		return;
	}
	const v = value.trim();
	if (!v) {
		return;
	}
	map[slug] = v;
}

/**
 * Sort token ids alphabetically so the JSON output is stable across exports.
 */
function sortMap(input: StringMap): StringMap {
	const keys = Object.keys(input);
	if (keys.length < 2) {
		return input;
	}
	keys.sort();
	const out: StringMap = {};
	for (const k of keys) {
		out[k] = input[k];
	}
	return out;
}

/**
 * Convert Blockera transform repeater rows to a single CSS `transform` value.
 * Mirrors the editor's `joinTransformCssFromRepeaterMap`, but operates on the
 * flat `items` array stored on theme.json transform presets and skips the
 * value-addon resolution (preset values are stored as raw CSS strings).
 */
function transformItemsToCss(items: unknown): string {
	if (!Array.isArray(items)) {
		return '';
	}
	const parts: string[] = [];
	for (const row of items) {
		if (!row || typeof row !== 'object') {
			continue;
		}
		const r = row as Record<string, unknown>;
		if (r.isVisible === false) {
			continue;
		}
		switch (r.type) {
			case 'move':
				parts.push(
					`translate3d(${String(r['move-x'] ?? '0px')}, ${String(
						r['move-y'] ?? '0px'
					)}, ${String(r['move-z'] ?? '0px')})`
				);
				break;
			case 'scale':
				parts.push(
					`scale3d(${String(r.scale ?? '100%')}, ${String(
						r.scale ?? '100%'
					)}, 50%)`
				);
				break;
			case 'rotate':
				parts.push(
					`rotateX(${String(r['rotate-x'] ?? '0deg')}) rotateY(${String(
						r['rotate-y'] ?? '0deg'
					)}) rotateZ(${String(r['rotate-z'] ?? '0deg')})`
				);
				break;
			case 'skew':
				parts.push(
					`skew(${String(r['skew-x'] ?? '0deg')}, ${String(
						r['skew-y'] ?? '0deg'
					)})`
				);
				break;
			default:
				break;
		}
	}
	return parts.join(' ');
}

/**
 * Convert Blockera filter repeater rows to a single CSS `filter` (or
 * `backdrop-filter`) value. Mirrors `FilterGenerator` minus the value-addon
 * dance — preset rows already carry resolved CSS values.
 */
function filterItemsToCss(items: unknown): string {
	if (!Array.isArray(items)) {
		return '';
	}
	const parts: string[] = [];
	for (const row of items) {
		if (!row || typeof row !== 'object') {
			continue;
		}
		const r = row as Record<string, unknown>;
		if (r.isVisible === false) {
			continue;
		}
		if (r.type === 'drop-shadow') {
			parts.push(
				`drop-shadow(${String(
					r['drop-shadow-x'] ?? '0px'
				)} ${String(r['drop-shadow-y'] ?? '0px')} ${String(
					r['drop-shadow-blur'] ?? '0px'
				)} ${String(r['drop-shadow-color'] ?? '#000')})`
			);
			continue;
		}
		if (typeof r.type === 'string' && r.type) {
			parts.push(`${r.type}(${String(r[r.type] ?? '')})`);
		}
	}
	return parts.join(' ');
}

/**
 * Mirrors `transition-generator.js`'s timing alias map so exported transition
 * tokens carry real `cubic-bezier(...)` values consumable outside Blockera.
 */
const TRANSITION_TIMING_MAP: Record<string, string> = {
	linear: 'linear',
	ease: 'ease',
	'ease-in': 'ease-in',
	'ease-out': 'ease-out',
	'ease-in-out': 'ease-in-out',
	'ease-in-quad': 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
	'ease-in-cubic': 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
	'ease-in-quart': 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
	'ease-in-quint': 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
	'ease-in-sine': 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
	'ease-in-expo': 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
	'ease-in-circ': 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
	'ease-in-back': 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
	'ease-out-quad': 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
	'ease-out-cubic': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
	'ease-out-quart': 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
	'ease-out-quint': 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
	'ease-out-sine': 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
	'ease-out-expo': 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
	'ease-out-circ': 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
	'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
	'ease-in-out-quad': 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
	'ease-in-out-cubic': 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
	'ease-in-out-quart': 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
	'ease-in-out-quint': 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
	'ease-in-out-sine': 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
	'ease-in-out-expo': 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
	'ease-in-out-circ': 'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
	'ease-in-out-back': 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
};

function resolveTransitionTiming(value: unknown): string {
	if (typeof value !== 'string' || !value) {
		return 'ease';
	}
	return TRANSITION_TIMING_MAP[value] || value;
}

/**
 * Convert Blockera transition repeater rows to a single CSS `transition` value.
 * Mirrors `TransitionGenerator`'s shape (`property duration timing delay`),
 * comma-joined per layer.
 */
function transitionItemsToCss(items: unknown): string {
	if (!Array.isArray(items)) {
		return '';
	}
	const parts: string[] = [];
	for (const row of items) {
		if (!row || typeof row !== 'object') {
			continue;
		}
		const r = row as Record<string, unknown>;
		if (r.isVisible === false) {
			continue;
		}
		const property = typeof r.type === 'string' && r.type ? r.type : 'all';
		const duration =
			typeof r.duration === 'string' && r.duration ? r.duration : '500ms';
		const delay = typeof r.delay === 'string' && r.delay ? r.delay : '0ms';
		const timing = resolveTransitionTiming(r.timing);
		parts.push(`${property} ${duration} ${timing} ${delay}`);
	}
	return parts.join(', ');
}

/**
 * Resolve a stored Blockera border-side ({ width, style, color }) — or a raw
 * CSS string fallback — into a single `<width> <style> <color>` declaration.
 * Color is read as a raw string when possible; value-addon objects fall back
 * to their resolved `.settings.value` if present, otherwise the slot is
 * dropped from the output.
 */
function borderToCss(border: unknown): string {
	if (typeof border === 'string') {
		return border.trim();
	}
	if (!border || typeof border !== 'object') {
		return '';
	}
	const b = border as Record<string, unknown>;
	const width = typeof b.width === 'string' ? b.width.trim() : '';
	const style = typeof b.style === 'string' ? b.style.trim() : '';
	let color = '';
	if (typeof b.color === 'string') {
		color = b.color.trim();
	} else if (b.color && typeof b.color === 'object') {
		// Value-addon shape: prefer the pre-resolved CSS value.
		const c = b.color as Record<string, unknown>;
		const settings = c.settings as Record<string, unknown> | undefined;
		const settingsValue =
			settings && typeof settings.value === 'string'
				? settings.value
				: '';
		const settingsVar =
			settings && typeof settings.var === 'string' ? settings.var : '';
		if (settingsValue) {
			color = settingsValue.trim();
		} else if (settingsVar) {
			color = `var(${settingsVar})`;
		}
	}
	const parts: string[] = [];
	if (width) {
		parts.push(width);
	}
	if (style) {
		parts.push(style);
	}
	if (color) {
		parts.push(color);
	}
	return parts.join(' ');
}

/**
 * Resolve a theme.json shadow/text-shadow preset to its raw CSS string. Both
 * preset namespaces share the same shape: `shadow: "<css>"` is the canonical
 * field; legacy presets used a string array under `items`.
 */
function shadowPresetToCss(preset: unknown): string {
	if (!preset || typeof preset !== 'object') {
		return '';
	}
	const p = preset as Record<string, unknown>;
	if (typeof p.shadow === 'string' && p.shadow.trim()) {
		return p.shadow.trim();
	}
	if (Array.isArray(p.items) && p.items.length) {
		const layers: string[] = [];
		for (const s of p.items) {
			if (typeof s === 'string' && s.trim()) {
				layers.push(s.trim());
			}
		}
		if (layers.length) {
			return layers.join(', ');
		}
	}
	return '';
}

/**
 * Convert a `var:preset|spacing|<slug>` or `var(--wp--preset--spacing--<slug>)`
 * reference back into the raw spacing CSS length. Returns the input unchanged
 * for plain CSS lengths or unknown slugs.
 */
function resolveSpacingRef(value: string, presets: StringMap): string {
	const v = value.trim();
	if (!v) {
		return '';
	}
	const colonForm = v.match(/^var:preset\|spacing\|(.+)$/);
	if (colonForm) {
		const slug = colonForm[1].trim();
		return presets[slug] || v;
	}
	const varForm = v.match(/^var\(\s*--wp--preset--spacing--([^),\s]+)\s*\)$/);
	if (varForm) {
		const slug = varForm[1].trim();
		return presets[slug] || v;
	}
	return v;
}

/**
 * Pick a single CSS length out of `styles.spacing.blockGap`, which can be:
 *  - a plain CSS length string (e.g. "30px")
 *  - a preset reference string (`var:preset|spacing|slug`, `var(--wp--preset--spacing--slug)`)
 *  - an object `{ top, left }` (advanced gap) — we prefer `top`, fall back to `left`.
 */
function resolveBlockGapToCssLength(
	blockGap: unknown,
	spacingPresets: StringMap
): string {
	if (typeof blockGap === 'string') {
		return resolveSpacingRef(blockGap, spacingPresets);
	}
	if (blockGap && typeof blockGap === 'object') {
		const o = blockGap as Record<string, unknown>;
		if (typeof o.top === 'string' && o.top.trim()) {
			return resolveSpacingRef(o.top, spacingPresets);
		}
		if (typeof o.left === 'string' && o.left.trim()) {
			return resolveSpacingRef(o.left, spacingPresets);
		}
	}
	return '';
}

/**
 * Build the site-tokens.json payload from the editor's merged
 * `__experimentalFeatures` (preset source-of-truth) plus the user/theme
 * `styles.spacing.blockGap` (read from the global styles entity).
 *
 * Output shape matches `structures/site/tokens.json` v1: every category is
 * always present (possibly empty) so downstream consumers don't need to
 * defensively check for missing keys.
 */
export function buildSiteTokensJson({
	features,
	layout,
	blockGap,
}: {
	features: Record<string, any> | null | undefined;
	layout: Record<string, any> | null | undefined;
	blockGap: unknown;
}): SiteTokensExport {
	const out: SiteTokensExport = {
		layout: {},
		categories: {
			color: {},
			spacing: {},
			'width-size': {},
			'font-family': {},
			'font-size': {},
			'border-radius': {},
			'box-shadow': {},
			'border-line': {},
			'text-shadow': {},
			transforms: {},
			filter: {},
			'backdrop-filter': {},
			transition: {},
		},
	};

	const f = features || {};
	const blockera = getBlockeraExperimentalFeatures(f);

	// color
	for (const item of flattenThemeCustomLayers<any>(f?.color?.palette)) {
		pushString(out.categories.color, item?.slug, item?.color);
	}

	// spacing
	for (const item of flattenThemeCustomLayers<any>(
		f?.spacing?.spacingSizes
	)) {
		pushString(out.categories.spacing, item?.slug, item?.size);
	}

	// width-size from layout sizes (settings.layout.{wideSize,contentSize})
	if (layout && typeof layout === 'object') {
		const wide = (layout as Record<string, unknown>).wideSize;
		const content = (layout as Record<string, unknown>).contentSize;
		if (typeof wide === 'string' && wide.trim()) {
			out.categories['width-size'].wide = wide.trim();
		}
		if (typeof content === 'string' && content.trim()) {
			out.categories['width-size'].content = content.trim();
		}
	}

	// font-family
	for (const item of flattenThemeCustomLayers<any>(
		f?.typography?.fontFamilies
	)) {
		pushString(out.categories['font-family'], item?.slug, item?.fontFamily);
	}

	// font-size
	for (const item of flattenThemeCustomLayers<any>(
		f?.typography?.fontSizes
	)) {
		pushString(out.categories['font-size'], item?.slug, item?.size);
	}

	// border-radius
	for (const item of flattenThemeCustomLayers<any>(f?.border?.radiusSizes)) {
		pushString(out.categories['border-radius'], item?.slug, item?.size);
	}

	// border-line — Blockera border presets ({ slug, name, border })
	for (const item of flattenThemeCustomLayers<any>(
		f?.border?.blockeraBorder?.presets
	)) {
		if (!item || typeof item !== 'object') {
			continue;
		}
		const css = borderToCss(item.border);
		pushString(out.categories['border-line'], item?.slug, css);
	}

	// box-shadow
	for (const preset of flattenThemeCustomLayers<any>(f?.shadow?.presets)) {
		pushString(
			out.categories['box-shadow'],
			preset?.slug,
			shadowPresetToCss(preset)
		);
	}

	// text-shadow
	for (const preset of flattenThemeCustomLayers<any>(
		blockera?.blockeraTextShadow?.presets
	)) {
		pushString(
			out.categories['text-shadow'],
			preset?.slug,
			shadowPresetToCss(preset)
		);
	}

	// transforms
	for (const preset of flattenThemeCustomLayers<any>(
		blockera?.blockeraTransform?.presets
	)) {
		if (!preset || typeof preset !== 'object') {
			continue;
		}
		const css = transformItemsToCss(preset.items);
		pushString(out.categories.transforms, preset?.slug, css);
	}

	// filter — also re-emit under `backdrop-filter` since Blockera doesn't
	// keep a separate preset namespace for backdrop-filter (the same filter
	// preset can be used for either CSS property).
	for (const preset of flattenThemeCustomLayers<any>(
		blockera?.blockeraFilter?.presets
	)) {
		if (!preset || typeof preset !== 'object') {
			continue;
		}
		const css = filterItemsToCss(preset.items);
		pushString(out.categories.filter, preset?.slug, css);
		pushString(out.categories['backdrop-filter'], preset?.slug, css);
	}

	// transition
	for (const preset of flattenThemeCustomLayers<any>(
		blockera?.blockeraTransition?.presets
	)) {
		if (!preset || typeof preset !== 'object') {
			continue;
		}
		const css = transitionItemsToCss(preset.items);
		pushString(out.categories.transition, preset?.slug, css);
	}

	// Resolve blockGap (may reference a spacing preset slug we just collected).
	const gap = resolveBlockGapToCssLength(blockGap, out.categories.spacing);
	if (gap) {
		out.layout.elementsGap = gap;
	}

	// Stable diffs: sort token ids within each category alphabetically.
	out.categories.color = sortMap(out.categories.color);
	out.categories.spacing = sortMap(out.categories.spacing);
	out.categories['width-size'] = sortMap(out.categories['width-size']);
	out.categories['font-family'] = sortMap(out.categories['font-family']);
	out.categories['font-size'] = sortMap(out.categories['font-size']);
	out.categories['border-radius'] = sortMap(out.categories['border-radius']);
	out.categories['box-shadow'] = sortMap(out.categories['box-shadow']);
	out.categories['border-line'] = sortMap(out.categories['border-line']);
	out.categories['text-shadow'] = sortMap(out.categories['text-shadow']);
	out.categories.transforms = sortMap(out.categories.transforms);
	out.categories.filter = sortMap(out.categories.filter);
	out.categories['backdrop-filter'] = sortMap(
		out.categories['backdrop-filter']
	);
	out.categories.transition = sortMap(out.categories.transition);

	return out;
}
