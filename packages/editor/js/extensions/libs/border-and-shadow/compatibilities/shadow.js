// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { getSortedRepeater, getValueAddonRealValue } from '@blockera/controls';
import { getColorVAFromVarString } from '@blockera/data';

/**
 * Resolve WordPress shadow preset to actual CSS box-shadow value
 *
 * @param {string} presetReference - WordPress preset reference (e.g., "var:preset|shadow|slug")
 * @return {string|null} Resolved CSS box-shadow value or null if not found
 */
function resolveShadowPreset(presetReference: string): ?string {
	if (!presetReference || typeof presetReference !== 'string') {
		return null;
	}

	// Extract slug from var:preset|shadow|slug or var(--wp--preset--shadow--slug)
	let slug: ?string = null;

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
			// Check theme presets first, then default presets
			const themePresets = shadowFeatures.presets.theme || [];
			const defaultPresets = shadowFeatures.presets.default || [];
			const allPresets = [...themePresets, ...defaultPresets];

			// Find the preset by slug
			const preset = allPresets.find((p: Object) => p.slug === slug);
			if (preset && preset.shadow) {
				return preset.shadow;
			}
		}

		// Fallback: check if presets are directly in shadowFeatures (flat array)
		if (shadowFeatures?.presets && Array.isArray(shadowFeatures.presets)) {
			const preset = shadowFeatures.presets.find(
				(p: Object) => p.slug === slug
			);
			if (preset && preset.shadow) {
				return preset.shadow;
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
function splitBoxShadowList(cssValue: string): Array<string> {
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
function extractColorFromShadowString(str: string): ?{
	color: string,
	dimensions: string,
} {
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
function parseSingleBoxShadow(shadowValue: string): ?{
	type: string,
	x: string,
	y: string,
	blur: string,
	spread: string,
	color: string,
} {
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
	type: string,
	x: string,
	y: string,
	blur: string,
	spread: string,
	color: string,
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
function shadowToCSS(shadowItem: Object): string {
	const inset = shadowItem.type === 'inner' ? 'inset ' : '';
	const x = shadowItem.x || '0px';
	const y = shadowItem.y || '0px';
	const blur = shadowItem.blur || '0px';
	const spread = shadowItem.spread || '0px';
	// color can be string (CSS color) or object (value addon format)
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
function stringifyBoxShadow(shadowItem: Object): string {
	return shadowToCSS(shadowItem);
}

/**
 * Parse theme.json / CSS box-shadow string into Blockera repeater object shape
 * (keys like outer-0, inner-1 — same as block blockeraBoxShadow.value).
 *
 * @param {string} shadowValue - CSS box-shadow (may include var:preset|shadow|…)
 * @return {Object} Repeater items map for BoxShadowControl store
 */
export function parseCssBoxShadowToRepeaterValue(shadowValue: string): Object {
	const parsed = parseBoxShadowList(shadowValue || '');
	const result: { [string]: Object } = {};
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
): Array<Object> {
	return Object.values(parseCssBoxShadowToRepeaterValue(shadowValue));
}

/**
 * Serialize BoxShadowControl repeater state to a CSS box-shadow string for theme.json.
 *
 * @param {?Object|Array<Object>} raw - Repeater items map (or legacy array)
 * @return {string} Combined CSS value
 */
export function formatControlItemsToCssBoxShadow(
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
		return visible.map((item) => stringifyBoxShadow(item)).join(', ');
	}

	if (typeof raw !== 'object') {
		return '';
	}

	// Block attribute shape: { value: { 'outer-0': … } }
	let repeaterItems: Object = raw;
	if (
		raw.value &&
		typeof raw.value === 'object' &&
		!Array.isArray(raw.value)
	) {
		const innerKeys = Object.keys(raw.value);
		if (innerKeys.some((k) => /^(outer|inner)-\d+$/.test(k))) {
			repeaterItems = raw.value;
		}
	}

	const sorted = getSortedRepeater(repeaterItems);
	const visible = sorted.filter(
		([, item]) => item && item.isVisible !== false
	);
	if (!visible.length) {
		return '';
	}
	return visible.map(([, item]) => stringifyBoxShadow(item)).join(', ');
}

/**
 * Get all WordPress shadow presets
 *
 * @return {Array<{slug: string, shadow: string}>} Array of preset objects
 */
function getAllShadowPresets(): Array<{ slug: string, shadow: string }> {
	try {
		const settings = select('core/block-editor')?.getSettings();
		if (!settings) {
			return [];
		}

		const shadowFeatures = settings?.__experimentalFeatures?.shadow;
		if (!shadowFeatures?.presets) {
			return [];
		}

		const themePresets = shadowFeatures.presets.theme || [];
		const defaultPresets = shadowFeatures.presets.default || [];
		const allPresets = [...themePresets, ...defaultPresets];

		return allPresets
			.filter((p: Object) => p.slug && p.shadow)
			.map((p: Object) => ({ slug: p.slug, shadow: p.shadow }));
	} catch (error) {
		return [];
	}
}

/**
 * Normalize a CSS box-shadow string for comparison (handles single and multiple shadows)
 *
 * @param {string} cssShadow - CSS box-shadow value
 * @return {string} Normalized string or empty if parse fails
 */
function normalizeShadowForComparison(cssShadow: string): string {
	const parts = splitBoxShadowList(cssShadow);
	const normalized = [];
	for (const part of parts) {
		const parsed = parseSingleBoxShadow(part);
		if (parsed) {
			normalized.push(shadowToCSS(parsed));
		}
	}
	return normalized.join(', ');
}

/**
 * Find a WordPress shadow preset that matches the given CSS box-shadow string
 *
 * @param {string} cssShadow - CSS box-shadow value (single or multiple)
 * @return {string|null} Preset reference (e.g. "var:preset|shadow|slug") or null
 */
function findMatchingShadowPresetForCSSString(cssShadow: string): ?string {
	const normalized = normalizeShadowForComparison(cssShadow);

	if (!normalized) {
		return null;
	}

	const presets = getAllShadowPresets();
	for (const preset of presets) {
		const presetNormalized = normalizeShadowForComparison(preset.shadow);
		if (presetNormalized && presetNormalized === normalized) {
			return `var:preset|shadow|${preset.slug}`;
		}
	}

	return null;
}

/**
 * Convert WordPress shadow attribute to Blockera format
 *
 * @param {Object} params - Parameters object
 * @param {Object} params.attributes - Block attributes
 * @param {boolean} params.insideBlockInspector - Whether we're in block inspector context
 * @return {Object} Updated attributes
 */
/**
 * Internal dependencies
 */
import { runInsideBlockInspector } from '../../utils';

export function shadowFromWPCompatibility({
	attributes,
	editorSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	attributes: Object,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
	insideBlockInspector: boolean,
}): Object {
	// Check if blockeraBoxShadow already has a value
	if (
		attributes?.blockeraBoxShadow &&
		Object.keys(attributes.blockeraBoxShadow?.value || {}).length > 0
	) {
		return attributes;
	}

	// Read shadow from appropriate location based on context
	const shadowValue = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? attributes?.style?.shadow
		: attributes?.shadow;

	if (!shadowValue) {
		return attributes;
	}

	// Parse the shadow value (handles multiple shadows from presets like "outlined")
	const parsedShadows = parseBoxShadowList(shadowValue);

	if (!parsedShadows || parsedShadows.length === 0) {
		return attributes;
	}

	const blockeraValue: { [string]: Object } = {};

	parsedShadows.forEach((parsedShadow, index) => {
		// Use key like 'outer-0', 'inner-1' based on type and order
		const shadowKey = `${parsedShadow.type}-${index}`;

		// Handle preset references and color values
		let colorValue: string | Object = parsedShadow.color;

		if (typeof colorValue === 'string') {
			if (
				!colorValue.startsWith('var:preset|shadow|') &&
				!colorValue.startsWith('var(--wp--preset--shadow--')
			) {
				const colorVA = getColorVAFromVarString(colorValue);
				if (colorVA) {
					colorValue = colorVA;
				}
			}
		}

		const shadowItem: Object = {
			isVisible: true,
			type: parsedShadow.type,
			x: parsedShadow.x,
			y: parsedShadow.y,
			blur: parsedShadow.blur,
			spread: parsedShadow.spread,
			color: colorValue,
			order: index,
		};

		blockeraValue[shadowKey] = shadowItem;
	});

	attributes.blockeraBoxShadow = {
		value: blockeraValue,
	};

	return attributes;
}

/**
 * Convert Blockera shadow format to WordPress format
 *
 * @param {Object} params - Parameters object
 * @param {Object} params.newValue - New shadow value from Blockera
 * @param {Object} params.ref - Control reference
 * @param {boolean} params.insideBlockInspector - Whether we're in block inspector context
 * @return {Object} WordPress-compatible attributes
 */
export function shadowToWPCompatibility({
	newValue,
	ref,
	editorSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	newValue: Object,
	ref?: Object,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
	insideBlockInspector: boolean,
}): Object {
	// Handle reset case
	if ('reset' === ref?.current?.action || newValue === '') {
		return runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? {
					style: {
						shadow: undefined,
					},
				}
			: {
					shadow: undefined,
				};
	}

	// Get sorted shadows from Blockera repeater format
	const sortedShadows = getSortedRepeater(newValue);

	if (!sortedShadows || sortedShadows.length === 0) {
		return runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? {
					style: {
						shadow: undefined,
					},
				}
			: {
					shadow: undefined,
				};
	}

	const visibleShadows = sortedShadows.filter(
		([, item]) => item.isVisible !== false
	);

	if (!visibleShadows || visibleShadows.length === 0) {
		return runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? {
					style: {
						shadow: undefined,
					},
				}
			: {
					shadow: undefined,
				};
	}

	// Build shadow value from all visible shadows
	const shadowValues: Array<string> = [];

	for (const [, shadowItem] of visibleShadows) {
		shadowValues.push(stringifyBoxShadow(shadowItem));
	}

	if (0 === shadowValues.length) {
		return runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? {
					style: {
						shadow: undefined,
					},
				}
			: {
					shadow: undefined,
				};
	}

	// Build combined shadow: single value or join multiple with comma
	const combinedShadow =
		shadowValues.length === 1 ? shadowValues[0] : shadowValues.join(', ');

	// Try to match combined shadow against WordPress presets (e.g. multi-shadow "outlined")
	const shadowValue = findMatchingShadowPresetForCSSString(combinedShadow);

	if (!shadowValue) {
		return runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? {
					style: {
						shadow: undefined,
					},
				}
			: {
					shadow: undefined,
				};
	}

	return runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? {
				style: {
					shadow: shadowValue,
				},
			}
		: {
				shadow: shadowValue,
			};
}
