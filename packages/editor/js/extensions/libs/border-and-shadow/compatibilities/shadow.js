// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { getSortedRepeater } from '@blockera/controls';
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
 * Parse a CSS box-shadow string into Blockera shadow format
 * Handles formats like: "0 1px 3px 0 rgba(0,0,0,0.1)" or "inset 0 0 0 3px currentColor"
 * Also handles WordPress preset format: "var:preset|shadow|slug" (resolves to CSS value)
 *
 * @param {string} shadowValue - CSS box-shadow value or WordPress preset reference
 * @return {Object|null} Blockera shadow object or null if parsing fails
 */
function parseBoxShadow(shadowValue: string): ?{
	type: string,
	x: string,
	y: string,
	blur: string,
	spread: string,
	color: string,
	presetReference?: string,
} {
	if (!shadowValue || typeof shadowValue !== 'string') {
		return null;
	}

	// Handle WordPress preset format: var:preset|shadow|slug
	// First, try to resolve it to the actual CSS value
	if (
		shadowValue.startsWith('var:preset|shadow|') ||
		shadowValue.startsWith('var(--wp--preset--shadow--')
	) {
		const resolvedValue = resolveShadowPreset(shadowValue);

		if (resolvedValue) {
			// Parse the resolved CSS value
			const parsed = parseBoxShadow(resolvedValue);
			if (parsed) {
				// Store the original preset reference for later conversion back
				parsed.presetReference = shadowValue;
				return parsed;
			}
		}

		// If resolution failed, store the preset reference as-is
		// This allows Blockera to work even if settings aren't available
		return {
			type: 'outer',
			x: '0px',
			y: '0px',
			blur: '0px',
			spread: '0px',
			color: shadowValue, // Keep the full preset reference
			presetReference: shadowValue,
		};
	}

	// Parse CSS box-shadow format: [inset] x y blur [spread] [color]
	const trimmed = shadowValue.trim();
	const parts = trimmed.split(/\s+/);

	let isInset = false;
	let startIndex = 0;

	// Check for inset keyword
	if (parts[0] === 'inset') {
		isInset = true;
		startIndex = 1;
	}

	// Need at least x, y, blur
	if (parts.length < startIndex + 3) {
		return null;
	}

	const x = parts[startIndex] || '0px';
	const y = parts[startIndex + 1] || '0px';
	const blur = parts[startIndex + 2] || '0px';

	// Determine spread and color positions
	// Spread is optional, so we need to check if the next part is a color or a spread value
	let spread = '0px';
	let colorStartIndex = startIndex + 3;

	if (parts.length > startIndex + 3) {
		// Check if the 4th part (after blur) looks like a color
		// Colors start with #, rgb(, rgba(, hsl(, hsla(, or color names
		const potentialColorStart = parts[startIndex + 3];
		const isColorStart =
			/^(#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\(|hsla\(|[a-zA-Z]+)/.test(
				potentialColorStart
			);

		if (isColorStart) {
			// The 4th part is a color, so there's no spread value
			spread = '0px';
			colorStartIndex = startIndex + 3;
		} else {
			// The 4th part is likely the spread value
			spread = parts[startIndex + 3];
			colorStartIndex = startIndex + 4;
		}
	}

	// Extract color if present
	if (parts.length > colorStartIndex) {
		// Check if the remaining parts form a color
		const potentialColor = parts.slice(colorStartIndex).join(' ');
		const colorMatch = potentialColor.match(
			/^(#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\(|hsla\(|[a-zA-Z]+)/
		);

		if (colorMatch) {
			// Extract the full color value (might span multiple parts for rgba/hsla)
			const colorParts = [];
			let i = colorStartIndex;
			while (i < parts.length) {
				colorParts.push(parts[i]);
				// If it's a function like rgba(), check if we've closed the parentheses
				if (parts[i].includes('(') && parts[i].includes(')')) {
					break;
				}
				if (parts[i].includes(')')) {
					break;
				}
				i++;
			}
			const color = colorParts.join(' ');

			return {
				type: isInset ? 'inner' : 'outer',
				x,
				y,
				blur,
				spread,
				color,
			};
		}
	}

	// No color specified, use default
	return {
		type: isInset ? 'inner' : 'outer',
		x,
		y,
		blur,
		spread,
		color: 'rgba(0, 0, 0, 0.3)',
	};
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
	const color = shadowItem.color || 'rgba(0, 0, 0, 0.3)';

	return `${inset}${x} ${y} ${blur} ${spread} ${color}`.trim();
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

	// Parse the shadow value
	const parsedShadow = parseBoxShadow(shadowValue);

	if (!parsedShadow) {
		return attributes;
	}

	// Convert to Blockera format (repeater with single item)
	// Use a key like 'outer-0' or 'inner-0' based on type
	const shadowKey = `${parsedShadow.type}-0`;

	// Handle preset references and color values
	// colorValue can be either a string (CSS color or preset reference) or an object (value addon format)
	let colorValue: string | Object = parsedShadow.color;

	// If we have a preset reference stored, we'll use it when writing back
	// For now, handle the color value
	if (typeof colorValue === 'string') {
		// If color is still a preset reference (resolution failed), keep it as-is
		if (
			colorValue.startsWith('var:preset|shadow|') ||
			colorValue.startsWith('var(--wp--preset--shadow--')
		) {
			// Keep the preset reference for later conversion back to WordPress format
			// colorValue stays as string with preset reference format
		}
		// Try to convert color string to value addon format if it's a color variable
		else {
			const colorVA = getColorVAFromVarString(colorValue);
			if (colorVA) {
				colorValue = colorVA;
			}
		}
	}

	// Store preset reference if available
	const presetReference = parsedShadow.presetReference;

	const shadowItem: Object = {
		isVisible: true,
		type: parsedShadow.type,
		x: parsedShadow.x,
		y: parsedShadow.y,
		blur: parsedShadow.blur,
		spread: parsedShadow.spread,
		color: colorValue,
		order: 0,
	};

	// Store preset reference if available (for later conversion back)
	if (presetReference) {
		shadowItem.presetReference = presetReference;
	}

	attributes.blockeraBoxShadow = {
		value: {
			[shadowKey]: shadowItem,
		},
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

	// WordPress only supports a single shadow, so we take the first visible one
	const firstVisibleShadow = sortedShadows.find(
		([, item]) => item.isVisible !== false
	);

	if (!firstVisibleShadow) {
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

	const [, shadowItem] = firstVisibleShadow;

	// Determine the shadow value to return
	let shadowValue: string;

	// Check if we have a stored preset reference (from when we read from WordPress)
	if (shadowItem.presetReference) {
		// Use the original preset reference
		shadowValue = shadowItem.presetReference;
	}
	// Check if color is a WordPress shadow preset reference
	else if (
		typeof shadowItem.color === 'string' &&
		shadowItem.color.startsWith('var:preset|shadow|')
	) {
		// Use the WordPress preset format directly
		shadowValue = shadowItem.color;
	}
	// Check if color is a CSS variable format (legacy or converted)
	else if (
		typeof shadowItem.color === 'string' &&
		shadowItem.color.startsWith('var(--wp--preset--shadow--')
	) {
		// Convert CSS variable to WordPress preset format
		const slugMatch = shadowItem.color.match(
			/var\(--wp--preset--shadow--([^)]+)\)/
		);
		if (slugMatch && slugMatch[1]) {
			shadowValue = `var:preset|shadow|${slugMatch[1]}`;
		} else {
			// Fallback to CSS value
			shadowValue = shadowToCSS(shadowItem);
		}
	}
	// Check if it's a color value addon (object format)
	else if (
		typeof shadowItem.color === 'object' &&
		shadowItem.color?.settings?.id
	) {
		// If it's a color preset, we need to generate CSS value
		// WordPress shadow doesn't support color presets directly, only shadow presets
		shadowValue = shadowToCSS(shadowItem);
	}
	// Default: convert to CSS string
	else {
		shadowValue = shadowToCSS(shadowItem);
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
