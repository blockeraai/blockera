// @flow

/**
 * Helpers to convert between CSS `text-shadow` strings (theme.json text shadow presets) and the
 * TextShadowControl repeater shape. Parsing splits on commas outside `()` so `rgb()`/`rgba()` stay intact.
 */

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { getSortedRepeater, getValueAddonRealValue } from '../';

/**
 * Split a CSS text-shadow list (commas outside of parentheses).
 *
 * @param {string} cssValue - CSS text-shadow value
 * @return {Array<string>} Individual shadow strings
 */
function splitTextShadowList(cssValue: string): Array<string> {
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
 * @param {string} str - Text-shadow string
 * @return {{ color: string, dimensions: string }|null} Extracted color and remaining dimensions, or null.
 */
function extractColorFromTextShadowString(str: string): ?{
	color: string,
	dimensions: string,
} {
	const trimmed = str.trim();
	if (!trimmed) {
		return null;
	}

	const colorFuncMatch = trimmed.match(/\s+(rgb|rgba|hsl|hsla)\([^)]+\)\s*$/);
	if (colorFuncMatch) {
		const color = colorFuncMatch[0].trim();
		const dimensions = trimmed
			.slice(0, trimmed.length - colorFuncMatch[0].length)
			.trim();
		return { color, dimensions };
	}

	const hexMatch = trimmed.match(/\s+(#[0-9a-fA-F]{3,8})\s*$/);
	if (hexMatch) {
		const color = hexMatch[1];
		const dimensions = trimmed
			.slice(0, trimmed.length - color.length)
			.trim();
		return { color, dimensions };
	}

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
 * @param {string} shadowValue - Single CSS text-shadow
 * @return {Object|null} Parsed offsets, blur, and color, or null.
 */
function parseSingleTextShadow(shadowValue: string): ?{
	x: string,
	y: string,
	blur: string,
	color: string,
} {
	if (!shadowValue || typeof shadowValue !== 'string') {
		return null;
	}

	const trimmed = shadowValue.trim();
	const dimStr = trimmed;

	const extracted = extractColorFromTextShadowString(dimStr);
	const dimensions = extracted ? extracted.dimensions : dimStr;
	const color = extracted ? extracted.color : 'rgba(0, 0, 0, 0.3)';

	const parts = dimensions.split(/\s+/);

	if (parts.length < 2) {
		return null;
	}

	const x = parts[0] || '0px';
	const y = parts[1] || '0px';
	const blur = parts.length > 2 ? parts[2] : '0px';

	return { x, y, blur, color };
}

/**
 * Resolve WordPress text-shadow preset reference to CSS (mirrors box-shadow preset resolution).
 * Reads `__experimentalFeatures.textShadow.presets` when present; core may not expose this yet.
 *
 * @param {string} presetReference - var:preset|text-shadow|slug or var(--wp--preset--text-shadow--…)
 * @return {string|null} Resolved CSS text-shadow, or null.
 */
function resolveTextShadowPreset(presetReference: string): ?string {
	if (!presetReference || typeof presetReference !== 'string') {
		return null;
	}

	let slug: ?string = null;

	if (presetReference.startsWith('var:preset|text-shadow|')) {
		slug = presetReference.replace('var:preset|text-shadow|', '');
	} else if (presetReference.startsWith('var:preset|textShadow|')) {
		slug = presetReference.replace('var:preset|textShadow|', '');
	} else if (presetReference.startsWith('var(--wp--preset--text-shadow--')) {
		const slugMatch = presetReference.match(
			/var\(--wp--preset--text-shadow--([^)]+)\)/
		);
		if (slugMatch && slugMatch[1]) {
			slug = slugMatch[1];
		}
	}

	if (!slug) {
		return null;
	}

	try {
		const settings = select('core/block-editor')?.getSettings();
		if (!settings) {
			return null;
		}

		const textShadowFeatures =
			settings?.__experimentalFeatures?.blockeraTextShadow;
		if (textShadowFeatures?.presets) {
			const themePresets = textShadowFeatures.presets.theme || [];
			const defaultPresets = textShadowFeatures.presets.default || [];
			const customPresets = textShadowFeatures.presets.custom || [];
			const allPresets = [
				...themePresets,
				...defaultPresets,
				...customPresets,
			];

			const preset = allPresets.find((p: Object) => p.slug === slug);
			const css = preset ? getTextShadowPresetCssValue(preset) : '';
			if (css) {
				return css;
			}
		}

		if (
			textShadowFeatures?.presets &&
			Array.isArray(textShadowFeatures.presets)
		) {
			const preset = textShadowFeatures.presets.find(
				(p: Object) => p.slug === slug
			);
			const css = preset ? getTextShadowPresetCssValue(preset) : '';
			if (css) {
				return css;
			}
		}
	} catch (error) {
		// select unavailable (e.g. tests)
	}

	return null;
}

/**
 * @param {string} shadowValue - Full CSS text-shadow
 * @return {Array<Object>} One object per shadow layer.
 */
function parseTextShadowLayers(shadowValue: string): Array<{
	x: string,
	y: string,
	blur: string,
	color: string,
}> {
	if (!shadowValue || typeof shadowValue !== 'string') {
		return [];
	}

	let cssToParse = shadowValue;

	if (
		shadowValue.startsWith('var:preset|text-shadow|') ||
		shadowValue.startsWith('var:preset|textShadow|') ||
		shadowValue.startsWith('var(--wp--preset--text-shadow--')
	) {
		const resolved = resolveTextShadowPreset(shadowValue);
		if (resolved) {
			cssToParse = resolved;
		} else {
			return [
				{
					x: '0px',
					y: '0px',
					blur: '0px',
					color: shadowValue,
				},
			];
		}
	}

	const parts = splitTextShadowList(cssToParse);
	const result = [];

	for (let i = 0; i < parts.length; i++) {
		const parsed = parseSingleTextShadow(parts[i]);
		if (parsed) {
			result.push(parsed);
		}
	}

	return result;
}

/**
 * Parse theme.json text-shadow preset CSS into Blockera TextShadowControl repeater map.
 *
 * @param {string} shadowValue - CSS text-shadow (optional var:preset|…)
 * @return {Object} Repeater items keyed by index string.
 */
export function parseCssTextShadowToRepeaterValue(shadowValue: string): Object {
	const parsed = parseTextShadowLayers(shadowValue || '');
	const result: { [string]: Object } = {};

	parsed.forEach((p, orderIndex) => {
		result[String(orderIndex)] = {
			x: p.x,
			y: p.y,
			blur: p.blur,
			color: p.color,
			isVisible: true,
			order: orderIndex,
		};
	});

	return result;
}

function stringifyTextShadowLayer(item: Object): string {
	const x = getValueAddonRealValue(item.x) || '0px';
	const y = getValueAddonRealValue(item.y) || '0px';
	const blur = getValueAddonRealValue(item.blur) || '0px';
	const color = getValueAddonRealValue(item.color) || 'transparent';

	return `${x} ${y} ${blur} ${color}`.trim();
}

/**
 * Serialize TextShadowControl repeater state to CSS text-shadow for theme.json presets.
 *
 * @param {?Object|Array<Object>} raw - Repeater map or array
 * @return {string} Combined CSS text-shadow value.
 */
export function formatRepeaterItemsToCssTextShadow(
	raw: ?(Object | Array<Object>)
): string {
	if (!raw) {
		return '';
	}

	if (Array.isArray(raw)) {
		const visible = raw.filter((item) => item && item.isVisible !== false);
		if (!visible.length) {
			return '';
		}
		return visible.map((item) => stringifyTextShadowLayer(item)).join(', ');
	}

	if (typeof raw !== 'object') {
		return '';
	}

	let repeaterItems: Object = raw;
	if (
		raw.value &&
		typeof raw.value === 'object' &&
		!Array.isArray(raw.value)
	) {
		repeaterItems = raw.value;
	}

	const sorted = getSortedRepeater(repeaterItems);
	const visible = sorted.filter(
		([, item]) => item && item.isVisible !== false
	);
	if (!visible.length) {
		return '';
	}
	return visible.map(([, item]) => stringifyTextShadowLayer(item)).join(', ');
}

/**
 * Resolved CSS `text-shadow` for a theme.json preset (`items` row objects, legacy string layers, or `shadow`).
 *
 * @param {Object} preset - Preset from __experimentalFeatures.textShadow.presets
 * @return {string} Combined CSS or empty
 */
function getTextShadowPresetCssValue(preset: Object): string {
	if (!preset || typeof preset !== 'object') {
		return '';
	}
	// Stored like shadow presets: { slug, name, shadow: "<css>" }
	if (preset.shadow && typeof preset.shadow === 'string') {
		const css = String(preset.shadow).trim();
		if (css) {
			return css;
		}
	}
	if (Array.isArray(preset.items) && preset.items.length) {
		const first = preset.items[0];
		if (first && typeof first === 'object' && !Array.isArray(first)) {
			const css = formatRepeaterItemsToCssTextShadow(preset.items);
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
