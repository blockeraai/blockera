/**
 * Scale stroke widths across an SVG icon (percentage relative to baseline at load).
 */

import { isSvgFillAccentElement } from '@blockera/icons';

import {
	SELECTABLE_SHAPE_TAGS,
	isInsideExcludedContainer,
} from './svg-editor-utils';

export const STROKE_BASELINE_ATTR = 'data-blockera-stroke-baseline';
export const STROKE_SOURCE_ATTR = 'data-blockera-stroke-source';

const STROKE_WIDTH_PROP = 'stroke-width';

/**
 * @param {string} styleString Inline style attribute value.
 * @return {Record<string, string>} Parsed inline style map.
 */
function parseInlineStyle(styleString) {
	const result = {};

	if (!styleString) {
		return result;
	}

	const parts = styleString.split(';');

	for (let i = 0; i < parts.length; i++) {
		const part = parts[i];
		const colonIndex = part.indexOf(':');

		if (colonIndex === -1) {
			continue;
		}

		const key = part.slice(0, colonIndex).trim().toLowerCase();
		const value = part.slice(colonIndex + 1).trim();

		if (key) {
			result[key] = value;
		}
	}

	return result;
}

/**
 * @param {Record<string, string>} styleMap Inline style map.
 * @return {string} Computed string value.
 */
function serializeInlineStyle(styleMap) {
	const parts = [];

	for (const key in styleMap) {
		if (!Object.prototype.hasOwnProperty.call(styleMap, key)) {
			continue;
		}

		const value = styleMap[key];

		if (value === undefined || value === '') {
			continue;
		}

		parts.push(`${key}: ${value}`);
	}

	return parts.join('; ');
}

/**
 * @param {string} raw Raw stroke-width value.
 * @return {{ num: number, unit: string } | null} Parsed stroke-width or null.
 */
function parseStrokeWidthValue(raw) {
	const trimmed = (raw || '').trim();

	if (!trimmed) {
		return null;
	}

	const num = parseFloat(trimmed);

	if (Number.isNaN(num)) {
		return null;
	}

	const unit = trimmed.replace(/^[-+]?[\d.]+/, '').trim();

	return { num, unit };
}

/**
 * @param {number} num   Numeric width.
 * @param {string} unit CSS unit suffix.
 * @return {string} Computed string value.
 */
function formatStrokeWidthValue(num, unit) {
	const rounded = Math.round(num * 1000) / 1000;

	if (unit) {
		return `${rounded}${unit}`;
	}

	return String(rounded);
}

/**
 * Whether stroke color is visible on an element (attribute, inline, or computed).
 *
 * @param {Element} element SVG shape element.
 * @param {Record<string, string>} inlineStyle Parsed inline style.
 * @return {boolean} Result of the check.
 */
function isStrokedElement(element, inlineStyle) {
	if (isSvgFillAccentElement(element)) {
		return false;
	}

	const stroke = element.getAttribute('stroke') || inlineStyle.stroke || '';
	const normalizedStroke = stroke.trim().toLowerCase();

	if (normalizedStroke === 'none' || normalizedStroke === 'transparent') {
		return false;
	}

	if (normalizedStroke !== '') {
		return true;
	}

	if (typeof window === 'undefined' || !element.ownerDocument?.defaultView) {
		return false;
	}

	const computed = window.getComputedStyle(element);
	const computedStroke = (computed.stroke || '').trim().toLowerCase();

	return (
		computedStroke !== '' &&
		computedStroke !== 'none' &&
		computedStroke !== 'transparent'
	);
}

/**
 * Read stroke-width from ancestor svg/g presentation attributes (user units).
 *
 * @param {Element} element SVG shape element.
 * @return {{ source: 'attr' | 'style', raw: string, parsed: { num: number, unit: string } } | null} Inherited stroke-width or null.
 */
function resolveInheritedStrokeWidthAttr(element) {
	let node = element.parentElement;

	while (node) {
		const tag = node.nodeName.toLowerCase();

		if (tag === 'svg' || tag === 'g') {
			const attrRaw = node.getAttribute('stroke-width');

			if (attrRaw !== null && attrRaw !== '') {
				const parsed = parseStrokeWidthValue(attrRaw);

				if (parsed) {
					return { source: 'attr', raw: attrRaw, parsed };
				}
			}
		}

		if (tag === 'svg') {
			break;
		}

		node = node.parentElement;
	}

	return null;
}

/**
 * Resolve baseline stroke-width for scaling (attribute, inline, computed, or default).
 *
 * @param {Element} element SVG shape element.
 * @return {{ source: 'attr' | 'style', raw: string, parsed: { num: number, unit: string } } | null} Stroke-width source info or null.
 */
function resolveStrokeWidthInfo(element) {
	const direct = readStrokeWidth(element);

	if (direct) {
		return direct;
	}

	const inlineStyle = parseInlineStyle(element.getAttribute('style') || '');

	if (!isStrokedElement(element, inlineStyle)) {
		return null;
	}

	// Prefer ancestor stroke-width in user units over computed px (viewBox-safe).
	const inherited = resolveInheritedStrokeWidthAttr(element);

	if (inherited) {
		return inherited;
	}

	if (typeof window !== 'undefined' && element.ownerDocument?.defaultView) {
		const computed = window.getComputedStyle(element);
		const computedParsed = parseStrokeWidthValue(computed.strokeWidth);

		if (computedParsed && computedParsed.num > 0) {
			return {
				source: 'attr',
				raw: formatStrokeWidthValue(
					computedParsed.num,
					computedParsed.unit
				),
				parsed: computedParsed,
			};
		}
	}

	return {
		source: 'attr',
		raw: '1',
		parsed: { num: 1, unit: '' },
	};
}

/**
 * Whether an element has a visible stroke we can scale.
 *
 * @param {Element} element SVG shape element.
 * @return {boolean} Result of the check.
 */
function elementHasExplicitStroke(element) {
	return resolveStrokeWidthInfo(element) !== null;
}

/**
 * Read stroke-width source and value from attributes or inline style.
 *
 * @param {Element} element SVG shape element.
 * @return {{ source: 'attr' | 'style', raw: string, parsed: { num: number, unit: string } } | null} Stroke-width source info or null.
 */
function readStrokeWidth(element) {
	const attrRaw = element.getAttribute('stroke-width');

	if (attrRaw !== null && attrRaw !== '') {
		const parsed = parseStrokeWidthValue(attrRaw);

		if (parsed) {
			return { source: 'attr', raw: attrRaw, parsed };
		}
	}

	const inlineStyle = parseInlineStyle(element.getAttribute('style') || '');
	const styleRaw = inlineStyle[STROKE_WIDTH_PROP];

	if (styleRaw) {
		const parsed = parseStrokeWidthValue(styleRaw);

		if (parsed) {
			return { source: 'style', raw: styleRaw, parsed };
		}
	}

	return null;
}

/**
 * Write stroke-width to attribute or inline style.
 *
 * @param {Element} element SVG shape element.
 * @param {'attr' | 'style'} source Target source.
 * @param {string} value         Formatted stroke-width value.
 */
function writeStrokeWidth(element, source, value) {
	if (source === 'attr') {
		element.setAttribute('stroke-width', value);
		return;
	}

	const inlineStyle = parseInlineStyle(element.getAttribute('style') || '');

	inlineStyle[STROKE_WIDTH_PROP] = value;

	const serialized = serializeInlineStyle(inlineStyle);

	if (serialized) {
		element.setAttribute('style', serialized);
	} else {
		element.removeAttribute('style');
	}
}

/**
 * Walk shape elements under an SVG root (skipping defs/mask/etc.).
 *
 * @param {Element} root SVG root.
 * @param {(element: Element) => void} callback Per-shape callback.
 */
function walkShapeElements(root, callback) {
	if (!root) {
		return;
	}

	const nodes = root.querySelectorAll(
		'path, rect, circle, ellipse, line, polyline, polygon'
	);

	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];

		if (
			node instanceof Element &&
			SELECTABLE_SHAPE_TAGS.has(node.nodeName.toLowerCase()) &&
			!isInsideExcludedContainer(node)
		) {
			callback(node);
		}
	}
}

/**
 * Whether the SVG contains any stroked shape (attributes + inline style only).
 *
 * @param {SVGSVGElement | null} rootSvg Root SVG element.
 * @return {boolean} Result of the check.
 */
export function hasAnyStrokeInSvg(rootSvg) {
	if (!rootSvg) {
		return false;
	}

	let found = false;

	walkShapeElements(rootSvg, (element) => {
		if (!found && elementHasExplicitStroke(element)) {
			found = true;
		}
	});

	return found;
}

/**
 * Tag stroked elements with baseline stroke-width values (100% scale reference).
 *
 * @param {SVGSVGElement | null} rootSvg Root SVG element.
 */
export function snapshotStrokeBaselines(rootSvg) {
	if (!rootSvg) {
		return;
	}

	walkShapeElements(rootSvg, (element) => {
		element.removeAttribute(STROKE_BASELINE_ATTR);
		element.removeAttribute(STROKE_SOURCE_ATTR);

		if (!elementHasExplicitStroke(element)) {
			return;
		}

		const widthInfo = resolveStrokeWidthInfo(element);

		if (!widthInfo) {
			return;
		}

		element.setAttribute(STROKE_BASELINE_ATTR, widthInfo.raw);
		element.setAttribute(STROKE_SOURCE_ATTR, widthInfo.source);
	});
}

/**
 * Apply a uniform percentage scale to all tagged stroke widths.
 *
 * @param {SVGSVGElement | null} rootSvg      Root SVG element.
 * @param {number} scalePercent               Scale factor where 100 = baseline.
 */
export function applyStrokeWidthScale(rootSvg, scalePercent) {
	if (!rootSvg || scalePercent <= 0) {
		return;
	}

	const factor = scalePercent / 100;

	walkShapeElements(rootSvg, (element) => {
		const baselineRaw = element.getAttribute(STROKE_BASELINE_ATTR);
		const source = element.getAttribute(STROKE_SOURCE_ATTR);

		if (!baselineRaw || (source !== 'attr' && source !== 'style')) {
			return;
		}

		const parsed = parseStrokeWidthValue(baselineRaw);

		if (!parsed) {
			return;
		}

		const nextValue = formatStrokeWidthValue(
			parsed.num * factor,
			parsed.unit
		);

		writeStrokeWidth(element, source, nextValue);
	});
}
