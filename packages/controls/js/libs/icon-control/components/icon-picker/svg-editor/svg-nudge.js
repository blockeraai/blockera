/**
 * Keyboard nudge utilities for SVG editor selection moves.
 */

import { canDeleteElement, canDeleteSelection } from './svg-editor-utils';

export const NUDGE_STEP = 1;
export const NUDGE_STEP_SHIFT = 10;

const TRANSLATE_RE =
	/translate\s*\(\s*([-+]?[\d.]+)(?:(?:\s*,\s*|\s+)([-+]?[\d.]+))?\s*\)/i;

/**
 * Resolve pixel delta from an arrow key event.
 *
 * @param {string}  key      KeyboardEvent.key.
 * @param {boolean} shiftKey Whether Shift is held.
 * @return {{ dx: number, dy: number } | null} Nudge delta or null when key is not a nudge.
 */
export function getNudgeDeltaFromKey(key, shiftKey) {
	const step = shiftKey ? NUDGE_STEP_SHIFT : NUDGE_STEP;

	switch (key) {
		case 'ArrowUp':
			return { dx: 0, dy: -step };
		case 'ArrowDown':
			return { dx: 0, dy: step };
		case 'ArrowLeft':
			return { dx: -step, dy: 0 };
		case 'ArrowRight':
			return { dx: step, dy: 0 };
		default:
			return null;
	}
}

/**
 * Whether every selected element can be nudged (not root svg).
 *
 * @param {Element[]}     elements Selected elements.
 * @param {SVGSVGElement} rootSvg  Root svg guard.
 * @return {boolean} Result of the check.
 */
export function canNudgeSelection(elements, rootSvg) {
	return canDeleteSelection(elements, rootSvg);
}

/**
 * Parse the first translate() from a transform attribute.
 *
 * @param {string} transformAttr Transform attribute value.
 * @return {{ x: number, y: number }} Parsed translate coordinates.
 */
function parseTranslateFromTransform(transformAttr) {
	if (!transformAttr || typeof transformAttr !== 'string') {
		return { x: 0, y: 0 };
	}

	const match = transformAttr.match(TRANSLATE_RE);

	if (!match) {
		return { x: 0, y: 0 };
	}

	const x = parseFloat(match[1]);
	const y = match[2] !== undefined ? parseFloat(match[2]) : 0;

	return {
		x: Number.isNaN(x) ? 0 : x,
		y: Number.isNaN(y) ? 0 : y,
	};
}

/**
 * Nudge one element by applying a parent-space translate.
 *
 * @param {Element} element Element to move.
 * @param {number}  dx      Horizontal delta (px).
 * @param {number}  dy      Vertical delta (px).
 * @return {boolean} True when the element was moved.
 */
function nudgeElement(element, dx, dy) {
	if (!element || (!dx && !dy)) {
		return false;
	}

	if (element instanceof SVGGraphicsElement) {
		const svg = element.ownerSVGElement;

		if (!svg) {
			return false;
		}

		const consolidated = element.transform.baseVal.consolidate();
		const matrix = consolidated
			? consolidated.matrix
			: svg.createSVGMatrix();
		const next = matrix.translate(dx, dy);

		element.transform.baseVal.initialize(
			svg.createSVGTransformFromMatrix(next)
		);

		return true;
	}

	const transformAttr = element.getAttribute('transform') || '';
	const trimmed = transformAttr.trim();

	if (!trimmed) {
		element.setAttribute('transform', `translate(${dx}, ${dy})`);
		return true;
	}

	if (/^translate\s*\(/i.test(trimmed)) {
		const { x, y } = parseTranslateFromTransform(trimmed);

		element.setAttribute('transform', `translate(${x + dx}, ${y + dy})`);

		return true;
	}

	element.setAttribute('transform', `${trimmed} translate(${dx}, ${dy})`);

	return true;
}

/**
 * Nudge all selected elements by the same delta.
 *
 * @param {Element[]}     elements Selected SVG elements.
 * @param {number}        dx       Horizontal delta (px).
 * @param {number}        dy       Vertical delta (px).
 * @param {SVGSVGElement} rootSvg  Root svg guard.
 * @return {number} Count of elements moved.
 */
export function nudgeElements(elements, dx, dy, rootSvg) {
	if (!elements?.length || (!dx && !dy) || !rootSvg) {
		return 0;
	}

	let moved = 0;

	for (let i = 0; i < elements.length; i++) {
		const element = elements[i];

		if (!canDeleteElement(element, rootSvg)) {
			continue;
		}

		if (nudgeElement(element, dx, dy)) {
			moved++;
		}
	}

	return moved;
}
