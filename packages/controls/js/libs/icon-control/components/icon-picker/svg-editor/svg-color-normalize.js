/**
 * Editor-local SVG color detection and normalization for theme icon color.
 */

import { isStrokeSvgMarkup, isSvgFillAccentElement } from '@blockera/icons';

import {
	parseSvgMarkup,
	serializeSvgElement,
	SELECTABLE_SHAPE_TAGS,
	isInsideExcludedContainer,
	parseInlineStyle,
} from './svg-editor-utils';

const PAINT_OK_VALUES = new Set([
	'none',
	'currentcolor',
	'inherit',
	'transparent',
]);

const SHAPE_SELECTOR = 'path, rect, circle, ellipse, line, polyline, polygon';

const SCAN_TAGS = new Set(['svg', 'g', ...SELECTABLE_SHAPE_TAGS]);

/**
 * @typedef {{ needsFix: boolean, variant: 'info' | 'warning', distinctFillCount: number }} SvgColorFixState
 */

/**
 * Whether a paint value is theme-ready (no hardcoded solid color).
 *
 * @param {string | null | undefined} raw Paint attribute or style value.
 * @return {boolean} Result of the check.
 */
function isThemeReadyPaintValue(raw) {
	if (!raw || typeof raw !== 'string') {
		return true;
	}

	const value = raw.trim();

	if (!value) {
		return true;
	}

	const lower = value.toLowerCase();

	if (PAINT_OK_VALUES.has(lower)) {
		return true;
	}

	if (lower.startsWith('url(')) {
		return true;
	}

	return false;
}

/**
 * Whether a paint value is a hardcoded solid color needing normalization.
 *
 * @param {string | null | undefined} raw Paint value.
 * @return {boolean} Result of the check.
 */
function isHardcodedSolidPaint(raw) {
	if (!raw || typeof raw !== 'string') {
		return false;
	}

	const value = raw.trim();

	if (!value) {
		return false;
	}

	return !isThemeReadyPaintValue(value);
}

/**
 * Whether a paint value is white (kept as-is during normalization).
 *
 * White is often used for highlights, cutouts, or accents inside multi-tone
 * icons and should not be rewritten to currentColor.
 *
 * @param {string | null | undefined} raw Paint value.
 * @return {boolean} Result of the check.
 */
function isWhitePaintValue(raw) {
	if (!raw || typeof raw !== 'string') {
		return false;
	}

	const value = raw.trim().toLowerCase();

	if (value === 'white') {
		return true;
	}

	const hexMatch = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/);

	if (hexMatch) {
		const hex = hexMatch[1];
		let r;
		let g;
		let b;

		if (hex.length === 3) {
			r = parseInt(hex[0] + hex[0], 16);
			g = parseInt(hex[1] + hex[1], 16);
			b = parseInt(hex[2] + hex[2], 16);
		} else {
			r = parseInt(hex.slice(0, 2), 16);
			g = parseInt(hex.slice(2, 4), 16);
			b = parseInt(hex.slice(4, 6), 16);
		}

		return r === 255 && g === 255 && b === 255;
	}

	const rgbMatch = value.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);

	if (rgbMatch) {
		return (
			Number(rgbMatch[1]) === 255 &&
			Number(rgbMatch[2]) === 255 &&
			Number(rgbMatch[3]) === 255
		);
	}

	const hslMatch = value.match(
		/^hsla?\(\s*[\d.]+\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%/
	);

	if (hslMatch) {
		return parseFloat(hslMatch[1]) === 0 && parseFloat(hslMatch[2]) === 100;
	}

	return false;
}

/**
 * Whether a hardcoded solid paint should be normalized (excludes white).
 *
 * @param {string | null | undefined} raw Paint value.
 * @return {boolean} Result of the check.
 */
function isNormalizableSolidPaint(raw) {
	return isHardcodedSolidPaint(raw) && !isWhitePaintValue(raw);
}

/**
 * Whether a fill/stroke value references a paint server (gradient, pattern, etc.).
 *
 * @param {string | null | undefined} raw Paint value.
 * @return {boolean} Result of the check.
 */
function isGradientPaintValue(raw) {
	if (!raw || typeof raw !== 'string') {
		return false;
	}

	return raw.trim().toLowerCase().startsWith('url(');
}

/**
 * Whether a paint value should be rewritten during normalization.
 *
 * @param {string | null | undefined} raw Paint value.
 * @return {boolean} Result of the check.
 */
function isNormalizablePaint(raw) {
	return isGradientPaintValue(raw) || isNormalizableSolidPaint(raw);
}

/**
 * Collect normalized hardcoded fill values from an element's fill sources.
 *
 * @param {Element} element SVG element.
 * @return {string[]} Distinct fill values needing fix.
 */
function collectHardcodedFillsFromElement(element) {
	const fills = [];

	const attrFill = element.getAttribute('fill');

	if (isNormalizablePaint(attrFill)) {
		fills.push(attrFill.trim().toLowerCase());
	}

	const inlineStyle = parseInlineStyle(element.getAttribute('style') || '');
	const styleFill = inlineStyle.fill;

	if (isNormalizablePaint(styleFill)) {
		fills.push(styleFill.trim().toLowerCase());
	}

	return fills;
}

/**
 * Whether element has hardcoded stroke needing fix.
 *
 * @param {Element} element SVG element.
 * @return {boolean} Result of the check.
 */
function elementHasHardcodedStroke(element) {
	const attrStroke = element.getAttribute('stroke');

	if (isNormalizablePaint(attrStroke)) {
		return true;
	}

	const inlineStyle = parseInlineStyle(element.getAttribute('style') || '');

	return isNormalizablePaint(inlineStyle.stroke);
}

/**
 * Elements to scan for paint attrs (root, groups, shapes) excluding defs/mask/etc.
 *
 * @param {SVGSVGElement} rootSvg Root SVG.
 * @return {Element[]} Matching DOM elements.
 */
function collectPaintScanElements(rootSvg) {
	const elements = [rootSvg];
	const shapes = rootSvg.querySelectorAll(SHAPE_SELECTOR);

	for (let i = 0; i < shapes.length; i++) {
		const shape = shapes[i];

		if (!isInsideExcludedContainer(shape)) {
			elements.push(shape);
		}
	}

	const groups = rootSvg.querySelectorAll('g');

	for (let i = 0; i < groups.length; i++) {
		const group = groups[i];

		if (isInsideExcludedContainer(group)) {
			continue;
		}

		const hasFill =
			group.hasAttribute('fill') ||
			parseInlineStyle(group.getAttribute('style') || '').fill;
		const hasStroke =
			group.hasAttribute('stroke') ||
			parseInlineStyle(group.getAttribute('style') || '').stroke;

		if (hasFill || hasStroke) {
			elements.push(group);
		}
	}

	return elements;
}

/**
 * Whether SVG markup needs color normalization for Blockera icon color.
 *
 * @param {string} svgString Raw SVG markup.
 * @return {SvgColorFixState} Color fix detection state.
 */
export function svgNeedsIconColorFix(svgString) {
	const empty = { needsFix: false, variant: 'info', distinctFillCount: 0 };

	if (!svgString || typeof svgString !== 'string') {
		return empty;
	}

	const rootSvg = parseSvgMarkup(svgString);

	if (!rootSvg) {
		return empty;
	}

	const scanElements = collectPaintScanElements(rootSvg);
	const distinctFills = new Set();
	let needsFix = false;

	for (let i = 0; i < scanElements.length; i++) {
		const element = scanElements[i];
		const hardcodedFills = collectHardcodedFillsFromElement(element);

		for (let j = 0; j < hardcodedFills.length; j++) {
			distinctFills.add(hardcodedFills[j]);
			needsFix = true;
		}

		if (elementHasHardcodedStroke(element)) {
			needsFix = true;
		}
	}

	if (!needsFix) {
		return empty;
	}

	return {
		needsFix: true,
		variant: distinctFills.size > 1 ? 'warning' : 'info',
		distinctFillCount: distinctFills.size,
	};
}

/**
 * Write or remove an inline style property; drop empty style attr.
 *
 * @param {Element} element Target element.
 * @param {string}    prop  CSS property name.
 * @param {string | null} value New value or null to remove.
 */
function setInlineStyleProp(element, prop, value) {
	const styleMap = parseInlineStyle(element.getAttribute('style') || '');

	if (value === null || value === undefined || value === '') {
		delete styleMap[prop];
	} else {
		styleMap[prop] = value;
	}

	const parts = [];

	for (const key in styleMap) {
		if (!Object.prototype.hasOwnProperty.call(styleMap, key)) {
			continue;
		}

		const propValue = styleMap[key];

		if (propValue !== undefined && propValue !== '') {
			parts.push(`${key}: ${propValue}`);
		}
	}

	if (parts.length) {
		element.setAttribute('style', parts.join('; '));
	} else {
		element.removeAttribute('style');
	}
}

/**
 * Normalize fill on an element for filled-icon branch.
 *
 * @param {Element} element SVG element.
 */
function normalizeFilledElementFill(element) {
	const attrFill = element.getAttribute('fill');
	const inlineStyle = parseInlineStyle(element.getAttribute('style') || '');

	if (isNormalizablePaint(attrFill)) {
		element.setAttribute('fill', 'currentColor');
	}

	if (isNormalizablePaint(inlineStyle.fill)) {
		setInlineStyleProp(element, 'fill', 'currentColor');
	}
}

/**
 * Normalize stroke on an element for filled-icon branch.
 *
 * @param {Element} element SVG element.
 */
function normalizeFilledElementStroke(element) {
	const attrStroke = element.getAttribute('stroke');
	const inlineStyle = parseInlineStyle(element.getAttribute('style') || '');

	if (isNormalizablePaint(attrStroke)) {
		element.setAttribute('stroke', 'currentColor');
	}

	if (isNormalizablePaint(inlineStyle.stroke)) {
		setInlineStyleProp(element, 'stroke', 'currentColor');
	}
}

/**
 * Rewrite inline stroke when it uses a hardcoded or gradient paint.
 *
 * @param {Element} element SVG element.
 * @param {string}  strokeValue Replacement stroke value.
 */
function normalizeInlineStroke(element, strokeValue) {
	const inlineStyle = parseInlineStyle(element.getAttribute('style') || '');

	if (isNormalizablePaint(inlineStyle.stroke)) {
		setInlineStyleProp(element, 'stroke', strokeValue);
	}
}

/**
 * Strip inline fill from an element (stroke-icon branch).
 *
 * @param {Element} element SVG element.
 */
function stripInlineFill(element) {
	const inlineStyle = parseInlineStyle(element.getAttribute('style') || '');

	if (
		inlineStyle.fill !== undefined &&
		!isWhitePaintValue(inlineStyle.fill)
	) {
		setInlineStyleProp(element, 'fill', null);
	}
}

/**
 * Normalize a stroke-based icon DOM tree (mirrors prepareIconSvgForStorage).
 *
 * @param {SVGSVGElement} rootSvg Root SVG element.
 */
function normalizeStrokeIconDom(rootSvg) {
	rootSvg.setAttribute('fill', 'none');

	if (
		!rootSvg.getAttribute('stroke') ||
		isNormalizablePaint(rootSvg.getAttribute('stroke'))
	) {
		rootSvg.setAttribute('stroke', 'currentColor');
	}

	normalizeInlineStroke(rootSvg, 'currentColor');
	stripInlineFill(rootSvg);

	const shapes = rootSvg.querySelectorAll(SHAPE_SELECTOR);

	for (let i = 0; i < shapes.length; i++) {
		const node = shapes[i];

		if (isInsideExcludedContainer(node)) {
			continue;
		}

		const isFillAccent = isSvgFillAccentElement(node);

		if (isFillAccent) {
			const rootStroke = rootSvg.getAttribute('stroke') || 'currentColor';
			const rootStrokeWidth = rootSvg.getAttribute('stroke-width');

			if (
				!node.getAttribute('stroke') ||
				isNormalizablePaint(node.getAttribute('stroke'))
			) {
				node.setAttribute('stroke', rootStroke);
			}

			if (rootStrokeWidth && !node.getAttribute('stroke-width')) {
				node.setAttribute('stroke-width', rootStrokeWidth);
			}

			normalizeInlineStroke(node, rootStroke);
			stripInlineFill(node);
			continue;
		}

		const nodeFill = node.getAttribute('fill');

		if (!isWhitePaintValue(nodeFill)) {
			node.setAttribute('fill', 'none');
		}

		if (
			!node.getAttribute('stroke') ||
			isNormalizablePaint(node.getAttribute('stroke'))
		) {
			node.setAttribute('stroke', 'currentColor');
		}

		normalizeInlineStroke(node, 'currentColor');
		stripInlineFill(node);
	}

	const withFill = rootSvg.querySelectorAll('[fill]');

	for (let i = 0; i < withFill.length; i++) {
		const node = withFill[i];

		if (isInsideExcludedContainer(node)) {
			continue;
		}

		if (isSvgFillAccentElement(node)) {
			continue;
		}

		const tag = node.nodeName.toLowerCase();

		if (!SCAN_TAGS.has(tag)) {
			continue;
		}

		const fill = node.getAttribute('fill');

		if (fill && fill.toLowerCase() !== 'none' && !isWhitePaintValue(fill)) {
			node.setAttribute('fill', 'none');
		}
	}
}

/**
 * Remove gradient definitions no longer referenced after paint normalization.
 *
 * @param {SVGSVGElement} rootSvg Root SVG element.
 */
function removeGradientDefinitions(rootSvg) {
	const gradients = rootSvg.querySelectorAll(
		'linearGradient, radialGradient'
	);

	for (let i = 0; i < gradients.length; i++) {
		const gradient = gradients[i];

		if (gradient.parentNode) {
			gradient.parentNode.removeChild(gradient);
		}
	}

	const defsElements = rootSvg.querySelectorAll('defs');

	for (let i = 0; i < defsElements.length; i++) {
		const defs = defsElements[i];

		if (!defs.childElementCount && defs.parentNode) {
			defs.parentNode.removeChild(defs);
		}
	}
}

/**
 * Normalize a filled-icon DOM tree to use currentColor for hardcoded paints.
 *
 * @param {SVGSVGElement} rootSvg Root SVG element.
 */
function normalizeFilledIconDom(rootSvg) {
	const scanElements = collectPaintScanElements(rootSvg);

	for (let i = 0; i < scanElements.length; i++) {
		const element = scanElements[i];

		normalizeFilledElementFill(element);
		normalizeFilledElementStroke(element);
	}
}

/**
 * Rewrite hardcoded fill/stroke colors so Blockera icon color can apply.
 *
 * @param {SVGSVGElement | null} rootSvg Live root SVG in the editor.
 */
export function normalizeSvgForIconColor(rootSvg) {
	if (!rootSvg || rootSvg.nodeName.toLowerCase() !== 'svg') {
		return;
	}

	let markup = '';

	try {
		markup = serializeSvgElement(rootSvg, { stripEditorAttrs: true });
	} catch (error) {
		markup = rootSvg.outerHTML || '';
	}

	if (isStrokeSvgMarkup(markup)) {
		normalizeStrokeIconDom(rootSvg);
	} else {
		normalizeFilledIconDom(rootSvg);
	}

	removeGradientDefinitions(rootSvg);
}
