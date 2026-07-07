/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { getSortedRepeater, getValueAddonRealValue } from '@blockera/controls';

/**
 * Resolved CSS `box-shadow` for a theme.json preset (`items` array or legacy `shadow` string).
 *
 * @param {Object} preset - Preset from __experimentalFeatures.shadow.presets
 * @return {string} Combined CSS or empty
 */
function getShadowPresetCssValue(preset: Record<string, unknown>): string {
	if (!preset || typeof preset !== 'object') {
		return '';
	}
	if (preset.shadow && typeof preset.shadow === 'string') {
		const css = String(preset.shadow).trim();
		if (css) {
			return css;
		}
	}
	if (Array.isArray(preset.items) && preset.items.length) {
		const first = preset.items[0];
		if (first && typeof first === 'object' && !Array.isArray(first)) {
			const css = formatControlItemsToCssBoxShadow(preset.items);
			if (css) {
				return css;
			}
		}
		const layers = preset.items
			.filter((s) => typeof s === 'string' && String(s).trim())
			.map((s) => String(s).trim());
		if (layers.length) {
			return layers.join(', ');
		}
	}
	return '';
}

/**
 * Resolve WordPress shadow preset to actual CSS box-shadow value
 *
 * @param {string} presetReference - WordPress preset reference (e.g., "var:preset|shadow|slug")
 * @return {string|null} Resolved CSS box-shadow value or null if not found
 */
function resolveShadowPreset(presetReference: string): string | null {
	if (!presetReference || typeof presetReference !== 'string') {
		return null;
	}

	// Extract slug from var:preset|shadow|slug or var(--wp--preset--shadow--slug)
	let slug: string | null = null;

	if (presetReference.startsWith('var:preset|shadow|')) {
		slug = presetReference.replace('var:preset|shadow|', '');
	} else if (presetReference.startsWith('var(--wp--preset--shadow--')) {
		const slugMatch = presetReference.match(
			/var\(--wp--preset--shadow--([^)]+)\)/
		);
		if (slugMatch && slugMatch[1]) {
			slug = slugMatch[1];
		}
	}

	if (!slug) {
		return null;
	}

	// Try to get settings from WordPress block editor
	try {
		const settings = select('core/block-editor')?.getSettings();
		if (!settings) {
			return null;
		}

		// Shadow presets are in __experimentalFeatures.shadow.presets
		// They may be in theme or default arrays
		const shadowFeatures = settings?.__experimentalFeatures?.shadow;
		if (shadowFeatures?.presets) {
			// Check theme presets first, then default presets, then custom (Site Editor).
			const themePresets = shadowFeatures.presets.theme || [];
			const defaultPresets = shadowFeatures.presets.default || [];
			const customPresets = shadowFeatures.presets.custom || [];
			const allPresets = [
				...themePresets,
				...defaultPresets,
				...customPresets,
			];

			// Find the preset by slug
			const preset = allPresets.find(
				(p: Record<string, unknown>) => p.slug === slug
			);
			const css = preset ? getShadowPresetCssValue(preset) : '';
			if (css) {
				return css;
			}
		}

		// Fallback: check if presets are directly in shadowFeatures (flat array)
		if (shadowFeatures?.presets && Array.isArray(shadowFeatures.presets)) {
			const preset = shadowFeatures.presets.find(
				(p: Record<string, unknown>) => p.slug === slug
			);
			const css = preset ? getShadowPresetCssValue(preset) : '';
			if (css) {
				return css;
			}
		}
	} catch (error) {
		// If select is not available (e.g., in test environment), return null
		// The caller will handle this case
	}

	return null;
}

/**
 * Split a CSS box-shadow list into individual shadow strings.
 * Respects commas inside rgb(), rgba(), hsl(), hsla(), etc.
 *
 * @param {string} cssValue - CSS box-shadow value (may contain multiple shadows)
 * @return {Array<string>} Array of individual shadow strings
 */
export function splitBoxShadowList(cssValue: string): Array<string> {
	const result = [];
	let current = '';
	let depth = 0;

	for (let i = 0; i < cssValue.length; i++) {
		const c = cssValue[i];
		if (c === '(') {
			depth++;
			current += c;
		} else if (c === ')') {
			depth--;
			current += c;
		} else if (c === ',' && depth === 0) {
			const trimmed = current.trim();
			if (trimmed) {
				result.push(trimmed);
			}
			current = '';
		} else {
			current += c;
		}
	}

	const trimmed = current.trim();
	if (trimmed) {
		result.push(trimmed);
	}

	return result;
}

/**
 * Extract color value from the end of a box-shadow string.
 * Handles rgb(), rgba(), hsl(), hsla() with commas - treats as single unit.
 *
 * @param {string} str - Box-shadow string
 * @return {{ color: string, dimensions: string }|null} Extracted color and remaining dimensions
 */
function extractColorFromShadowString(
	str: string
): { color: string; dimensions: string } | null {
	const trimmed = str.trim();
	if (!trimmed) {
		return null;
	}

	// Find color at end - rgb/rgba/hsl/hsla contain commas, must extract as unit
	const colorFuncMatch = trimmed.match(/\s+(rgb|rgba|hsl|hsla)\([^)]+\)\s*$/);
	if (colorFuncMatch) {
		const color = colorFuncMatch[0].trim();
		const dimensions = trimmed
			.slice(0, trimmed.length - colorFuncMatch[0].length)
			.trim();
		return { color, dimensions };
	}

	// Hex color at end
	const hexMatch = trimmed.match(/\s+(#[0-9a-fA-F]{3,8})\s*$/);
	if (hexMatch) {
		const color = hexMatch[1];
		const dimensions = trimmed
			.slice(0, trimmed.length - color.length)
			.trim();
		return { color, dimensions };
	}

	// Color name (single word) at end
	const wordMatch = trimmed.match(/\s+([a-zA-Z]+)\s*$/);
	if (wordMatch) {
		const color = wordMatch[1];
		const dimensions = trimmed
			.slice(0, trimmed.length - color.length)
			.trim();
		return { color, dimensions };
	}

	return null;
}

/**
 * Parse a single CSS box-shadow string (no preset format, no comma)
 * Correctly handles rgb(), rgba(), hsl(), hsla() which contain commas.
 *
 * @param {string} shadowValue - Single CSS box-shadow value
 * @return {Object|null} Blockera shadow object or null if parsing fails
 */
function parseSingleBoxShadow(shadowValue: string): {
	type: string;
	x: string;
	y: string;
	blur: string;
	spread: string;
	color: string;
} | null {
	if (!shadowValue || typeof shadowValue !== 'string') {
		return null;
	}

	const trimmed = shadowValue.trim();
	let isInset = false;
	let dimStr = trimmed;

	if (trimmed.startsWith('inset ')) {
		isInset = true;
		dimStr = trimmed.slice(6).trim();
	}

	// Extract color first (handles rgb/rgba/hsl/hsla with commas)
	const extracted = extractColorFromShadowString(dimStr);
	const dimensions = extracted ? extracted.dimensions : dimStr;
	const color = extracted ? extracted.color : 'rgba(0, 0, 0, 0.3)';

	const parts = dimensions.split(/\s+/);

	// Need at least x, y (blur can default to 0)
	if (parts.length < 2) {
		return null;
	}

	const x = parts[0] || '0px';
	const y = parts[1] || '0px';
	const blur = parts.length > 2 ? parts[2] : '0px';
	const spread = parts.length > 3 ? parts[3] : '0px';

	return {
		type: isInset ? 'inner' : 'outer',
		x,
		y,
		blur,
		spread,
		color,
	};
}

/**
 * Parse CSS box-shadow value into array of Blockera shadow items.
 * Handles presets that resolve to multiple shadows (e.g. "6px 6px 0px -3px rgb(255,255,255), 6px 6px rgb(0,0,0)").
 *
 * @param {string} shadowValue - CSS box-shadow value or WordPress preset reference
 * @return {Array<Object>} Array of Blockera shadow objects
 */
function parseBoxShadowList(shadowValue: string): Array<{
	type: string;
	x: string;
	y: string;
	blur: string;
	spread: string;
	color: string;
}> {
	if (!shadowValue || typeof shadowValue !== 'string') {
		return [];
	}

	let cssToParse = shadowValue;

	// Handle WordPress preset format
	if (
		shadowValue.startsWith('var:preset|shadow|') ||
		shadowValue.startsWith('var(--wp--preset--shadow--')
	) {
		const resolved = resolveShadowPreset(shadowValue);
		if (resolved) {
			cssToParse = resolved;
		} else {
			// Resolution failed - return single placeholder item with preset as color
			return [
				{
					type: 'outer',
					x: '0px',
					y: '0px',
					blur: '0px',
					spread: '0px',
					color: shadowValue,
				},
			];
		}
	}

	const parts = splitBoxShadowList(cssToParse);
	const result = [];

	for (let i = 0; i < parts.length; i++) {
		const parsed = parseSingleBoxShadow(parts[i]);
		if (parsed) {
			result.push(parsed);
		}
	}

	return result;
}

/**
 * Convert Blockera shadow format to CSS box-shadow string
 *
 * @param {Object} shadowItem - Blockera shadow item
 * @return {string} CSS box-shadow value
 */
function shadowToCSS(shadowItem: Record<string, unknown>): string {
	const inset = shadowItem.type === 'inner' ? 'inset ' : '';
	const x = (shadowItem.x as string) || '0px';
	const y = (shadowItem.y as string) || '0px';
	const blur = (shadowItem.blur as string) || '0px';
	const spread = (shadowItem.spread as string) || '0px';
	const color =
		getValueAddonRealValue(shadowItem.color) || 'rgba(0, 0, 0, 0.3)';

	return `${inset}${x} ${y} ${blur} ${spread} ${color}`.trim();
}

/**
 * Stringify Blockera shadow item to CSS box-shadow value.
 * Used for preset matching and output.
 *
 * @param {Object} shadowItem - Blockera shadow item
 * @return {string} CSS box-shadow value
 */
function stringifyBoxShadow(shadowItem: Record<string, unknown>): string {
	return shadowToCSS(shadowItem);
}

/**
 * Parse theme.json / CSS box-shadow string into Blockera repeater object shape
 * (keys like outer-0, inner-1 — same as block blockeraBoxShadow.value).
 *
 * @param {string} shadowValue - CSS box-shadow (may include var:preset|shadow|…)
 * @return {Object} Repeater items map for BoxShadowControl store
 */
export function parseCssBoxShadowToRepeaterValue(
	shadowValue: string
): Record<string, Record<string, unknown>> {
	const parsed = parseBoxShadowList(shadowValue || '');
	const result: Record<string, Record<string, unknown>> = {};
	const typeCounts = { outer: 0, inner: 0 };

	parsed.forEach((p, orderIndex) => {
		const t = p.type === 'inner' ? 'inner' : 'outer';
		const idx = typeCounts[t]++;
		const key = `${t}-${idx}`;
		result[key] = {
			type: t,
			x: p.x,
			y: p.y,
			blur: p.blur,
			spread: p.spread,
			color: p.color,
			isVisible: true,
			order: orderIndex,
		};
	});

	return result;
}

/**
 * @deprecated Use parseCssBoxShadowToRepeaterValue — BoxShadowControl expects an object map, not an array.
 */
export function parseCssBoxShadowToControlItems(
	shadowValue: string
): Array<Record<string, unknown>> {
	return Object.values(parseCssBoxShadowToRepeaterValue(shadowValue));
}

/**
 * Serialize BoxShadowControl repeater state to a CSS box-shadow string for theme.json.
 *
 * @param {?Object|Array<Object>} raw - Repeater items map (or legacy array)
 * @return {string} Combined CSS value
 */
export function formatControlItemsToCssBoxShadow(
	raw:
		| Record<string, unknown>
		| Array<Record<string, unknown>>
		| null
		| undefined
): string {
	if (!raw) {
		return '';
	}

	if (Array.isArray(raw)) {
		const visible = raw.filter((item) => item && item.isVisible !== false);
		if (!visible.length) {
			return '';
		}
		return visible.map((item) => stringifyBoxShadow(item)).join(', ');
	}

	if (typeof raw !== 'object') {
		return '';
	}

	let repeaterItems: Record<string, unknown> = raw;
	if (
		raw.value &&
		typeof raw.value === 'object' &&
		!Array.isArray(raw.value)
	) {
		const innerKeys = Object.keys(raw.value as Record<string, unknown>);
		if (innerKeys.some((k) => /^(outer|inner)-\d+$/.test(k))) {
			repeaterItems = raw.value as Record<string, unknown>;
		}
	}

	const sorted = getSortedRepeater(repeaterItems);
	const visible = sorted.filter(
		([, item]) =>
			item && (item as Record<string, unknown>).isVisible !== false
	);
	if (!visible.length) {
		return '';
	}
	return visible
		.map(([, item]) => stringifyBoxShadow(item as Record<string, unknown>))
		.join(', ');
}
