/**
 * SVG editor DOM utilities: parse, serialize, selection context, delete.
 */

import { isStrokeSvgMarkup, isSvgFillAccentElement } from '@blockera/icons';

import { splitPathElement } from './svg-path-split';

/** @typedef {SVGElement | SVGGraphicsElement} SvgEditorNode */

export const SELECTABLE_SHAPE_TAGS = new Set([
	'path',
	'rect',
	'circle',
	'ellipse',
	'line',
	'polyline',
	'polygon',
]);

export const EXCLUDED_CONTAINER_TAGS = new Set([
	'defs',
	'clippath',
	'mask',
	'style',
	'metadata',
	'title',
	'desc',
	'symbol',
	'marker',
	'pattern',
	'lineargradient',
	'radialgradient',
]);

export const SVG_EDITOR_SELECTED_CLASS = 'blockera-svg-editor-selected';
export const SVG_EDITOR_HOVER_CLASS = 'blockera-svg-editor-hoverable';
export const SVG_EDITOR_OVERLAY_CLASS = 'blockera-svg-editor-selection-overlay';

/**
 * Parse SVG markup into a document element.
 *
 * @param {string} svgString Raw SVG string.
 * @return {SVGSVGElement | null} Root svg element or null when invalid.
 */
export function parseSvgMarkup(svgString) {
	if (!svgString || typeof svgString !== 'string') {
		return null;
	}

	let doc;

	try {
		doc = new DOMParser().parseFromString(svgString, 'image/svg+xml');
	} catch (error) {
		return null;
	}

	if (doc.querySelector('parsererror')) {
		return null;
	}

	const svg = doc.documentElement;

	if (!svg || svg.nodeName.toLowerCase() !== 'svg') {
		return null;
	}

	return /** @type {SVGSVGElement} */ (svg);
}

/**
 * Serialize an SVG element to string (optionally strip editor-only attributes).
 *
 * @param {Element} svgElement SVG root or subtree.
 * @param {{ stripEditorAttrs?: boolean }} options Serialization options.
 * @return {string} Serialized markup.
 */
export function serializeSvgElement(svgElement, options = {}) {
	if (!svgElement) {
		return '';
	}

	const { stripEditorAttrs = false } = options;

	if (!stripEditorAttrs) {
		try {
			return new XMLSerializer().serializeToString(svgElement);
		} catch (error) {
			return '';
		}
	}

	const clone = svgElement.cloneNode(true);

	stripEditorAttributesFromClone(clone);

	try {
		return new XMLSerializer().serializeToString(clone);
	} catch (error) {
		return '';
	}
}

/**
 * Strip all editor-only data attributes from a cloned SVG tree before commit.
 *
 * @param {Element} root Cloned SVG root.
 */
function stripEditorAttributesFromClone(root) {
	if (!root) {
		return;
	}

	const editorAttrs = root.querySelectorAll(
		'[data-blockera-editor-highlight], [data-blockera-stroke-baseline], [data-blockera-stroke-source]'
	);

	for (let i = 0; i < editorAttrs.length; i++) {
		const node = editorAttrs[i];

		node.removeAttribute('data-blockera-editor-highlight');
		node.removeAttribute('data-blockera-stroke-baseline');
		node.removeAttribute('data-blockera-stroke-source');
	}

	const selectedNodes = root.querySelectorAll(
		`.${SVG_EDITOR_SELECTED_CLASS}`
	);

	for (let i = 0; i < selectedNodes.length; i++) {
		selectedNodes[i].classList.remove(SVG_EDITOR_SELECTED_CLASS);
	}
}

/**
 * Whether a node is a selectable direct child candidate (shape or group with content).
 *
 * @param {Element} element Candidate element.
 * @return {boolean} Result of the check.
 */
export function isSelectableDirectChild(element) {
	if (!element || element.nodeType !== 1) {
		return false;
	}

	const tag = element.nodeName.toLowerCase();

	if (EXCLUDED_CONTAINER_TAGS.has(tag)) {
		return false;
	}

	if (SELECTABLE_SHAPE_TAGS.has(tag)) {
		return true;
	}

	if (tag === 'g') {
		return groupHasSelectableContent(element);
	}

	return false;
}

/**
 * Whether a group contains any selectable shape descendants.
 *
 * @param {Element} groupElement Group element.
 * @return {boolean} Result of the check.
 */
export function groupHasSelectableContent(groupElement) {
	const shapes = groupElement.querySelectorAll(
		'path, rect, circle, ellipse, line, polyline, polygon'
	);

	for (let i = 0; i < shapes.length; i++) {
		const shape = shapes[i];

		if (!isInsideExcludedContainer(shape)) {
			return true;
		}
	}

	return false;
}

/**
 * Whether an element lives inside defs/clipPath/mask.
 *
 * @param {Element} element Element to check.
 * @return {boolean} Result of the check.
 */
export function isInsideExcludedContainer(element) {
	let parent = element.parentElement;

	while (parent) {
		const tag = parent.nodeName.toLowerCase();

		if (EXCLUDED_CONTAINER_TAGS.has(tag)) {
			return true;
		}

		if (tag === 'svg') {
			return false;
		}

		parent = parent.parentElement;
	}

	return false;
}

/**
 * Direct selectable children of the current drill context (svg or g).
 *
 * @param {Element} context Root svg or drilled group.
 * @return {Element[]} Selectable direct children.
 */
export function getDirectSelectableChildren(context) {
	const children = [];

	if (!context) {
		return children;
	}

	for (let i = 0; i < context.childNodes.length; i++) {
		const node = context.childNodes[i];

		if (node.nodeType !== 1) {
			continue;
		}

		if (isSelectableDirectChild(/** @type {Element} */ (node))) {
			children.push(/** @type {Element} */ (node));
		}
	}

	return children;
}

/**
 * Resolve click target as a direct child of the current context under the pointer.
 *
 * @param {MouseEvent} event         Click event.
 * @param {Element}    context       Current drill context.
 * @return {Element | null} Matching direct child or null.
 */
export function resolveClickTarget(event, context) {
	let target = /** @type {Element | null} */ (event.target);

	while (target && target !== context) {
		if (
			target.parentElement === context &&
			isSelectableDirectChild(target)
		) {
			return target;
		}

		target = target.parentElement;
	}

	return null;
}

/**
 * Remove element from its parent.
 *
 * @param {Element} element Element to remove.
 * @return {boolean} True when removed.
 */
export function removeElement(element) {
	if (!element?.parentNode) {
		return false;
	}

	element.parentNode.removeChild(element);

	return true;
}

/**
 * Human-readable label for breadcrumb / a11y.
 *
 * @param {Element} element SVG element.
 * @return {string} Computed string value.
 */
export function getElementLabel(element) {
	if (!element) {
		return '';
	}

	const tag = element.nodeName.toLowerCase();

	if (element.id) {
		return `${tag}#${element.id}`;
	}

	return tag;
}

/**
 * Build breadcrumb chain from root svg to current context.
 *
 * @param {SVGSVGElement} rootSvg   Root svg.
 * @param {Element}       context   Current drill context.
 * @return {Element[]} Ancestors from root to context (inclusive).
 */
export function getContextBreadcrumb(rootSvg, context) {
	const chain = [];
	let node = context;

	while (node && node !== rootSvg.parentElement) {
		chain.unshift(node);

		if (node === rootSvg) {
			break;
		}

		node = node.parentElement;
	}

	return chain;
}

/**
 * Parse inline style attribute into a plain object (lowercase keys).
 *
 * @param {string} styleAttr Style attribute value.
 * @return {Record<string, string>} Parsed inline style map.
 */
export function parseInlineStyle(styleAttr) {
	const result = {};

	if (!styleAttr || typeof styleAttr !== 'string') {
		return result;
	}

	const parts = styleAttr.split(';');

	for (let i = 0; i < parts.length; i++) {
		const part = parts[i].trim();

		if (!part) {
			continue;
		}

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
 * Whether the element can be deleted (not root svg).
 *
 * @param {Element | null} element Candidate element.
 * @param {SVGSVGElement}  rootSvg Root svg guard.
 * @return {boolean} Result of the check.
 */
export function canDeleteElement(element, rootSvg) {
	return Boolean(element && element !== rootSvg && element.parentNode);
}

/**
 * Whether every element in the selection can be deleted.
 *
 * @param {Element[]}     elements Selected elements.
 * @param {SVGSVGElement} rootSvg  Root svg guard.
 * @return {boolean} Result of the check.
 */
export function canDeleteSelection(elements, rootSvg) {
	if (!elements?.length) {
		return false;
	}

	for (let i = 0; i < elements.length; i++) {
		if (!canDeleteElement(elements[i], rootSvg)) {
			return false;
		}
	}

	return true;
}

/**
 * Remove multiple elements from the document (reverse tree order).
 *
 * @param {Element[]} elements Elements to remove.
 * @return {number} Count removed.
 */
export function removeElements(elements) {
	if (!elements?.length) {
		return 0;
	}

	const sorted = [...elements];

	sorted.sort((a, b) => {
		const position = a.compareDocumentPosition(b);

		// compareDocumentPosition returns a bitmask; bitwise check is required.
		// eslint-disable-next-line no-bitwise
		if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
			return 1;
		}

		// eslint-disable-next-line no-bitwise
		if (position & Node.DOCUMENT_POSITION_PRECEDING) {
			return -1;
		}

		return 0;
	});

	let removed = 0;

	for (let i = sorted.length - 1; i >= 0; i--) {
		if (removeElement(sorted[i])) {
			removed++;
		}
	}

	return removed;
}

/**
 * Whether two DOMRects intersect.
 *
 * @param {DOMRect} a First rect.
 * @param {DOMRect} b Second rect.
 * @return {boolean} Result of the check.
 */
export function rectsIntersect(a, b) {
	return !(
		a.right < b.left ||
		a.left > b.right ||
		a.bottom < b.top ||
		a.top > b.bottom
	);
}

/**
 * Normalize drag coordinates into a DOMRect-like object.
 *
 * @param {number} x1 Start client X.
 * @param {number} y1 Start client Y.
 * @param {number} x2 End client X.
 * @param {number} y2 End client Y.
 * @return {{ left: number, top: number, right: number, bottom: number }} Normalized marquee rectangle.
 */
export function normalizeMarqueeRect(x1, y1, x2, y2) {
	const left = Math.min(x1, x2);
	const top = Math.min(y1, y2);
	const right = Math.max(x1, x2);
	const bottom = Math.max(y1, y2);

	return { left, top, right, bottom };
}

/**
 * Direct selectable children whose screen bounds intersect a client rect.
 *
 * @param {Element} context    Current drill context.
 * @param {{ left: number, top: number, right: number, bottom: number }} clientRect Marquee in client coords.
 * @return {Element[]} Matching elements.
 */
export function getSelectableElementsInClientRect(context, clientRect) {
	const children = getDirectSelectableChildren(context);
	const matched = [];

	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		const childRect = child.getBoundingClientRect();

		if (rectsIntersect(clientRect, childRect)) {
			matched.push(child);
		}
	}

	return matched;
}

const PATH_D_ATTR_SKIP = new Set([
	'd',
	'id',
	'transform',
	'data-blockera-editor-highlight',
]);

/**
 * Whether the selected element is an SVG group that can be ungrouped.
 *
 * @param {Element | null} element Candidate element.
 * @param {SVGSVGElement | null} rootSvg Root svg guard.
 * @return {boolean} Result of the check.
 */
export function canUngroupElement(element, rootSvg) {
	if (!element || element === rootSvg || !element.parentElement) {
		return false;
	}

	if (element.nodeName.toLowerCase() !== 'g') {
		return false;
	}

	for (let i = 0; i < element.childNodes.length; i++) {
		const node = element.childNodes[i];

		if (node.nodeType !== 1) {
			continue;
		}

		const childTag = node.nodeName.toLowerCase();

		if (EXCLUDED_CONTAINER_TAGS.has(childTag)) {
			continue;
		}

		return true;
	}

	return false;
}

/**
 * Split a compound `<path>` into one path element per subpath (sync shell — use async split).
 *
 * @param {Element} pathElement Path element to split.
 * @param {string[]} subpaths   Absolute path data per subpath.
 * @return {{ ok: boolean, lifted?: Element[], parent?: Element, reason?: string, kind?: string }} Operation result.
 */
export function ungroupPathElementWithSubpaths(pathElement, subpaths) {
	if (!pathElement?.parentElement) {
		return { ok: false, reason: 'no-parent' };
	}

	if (pathElement.nodeName.toLowerCase() !== 'path') {
		return { ok: false, reason: 'not-path' };
	}

	if (!subpaths || subpaths.length <= 1) {
		return { ok: false, reason: 'single-subpath' };
	}

	const parent = pathElement.parentElement;
	const doc = pathElement.ownerDocument;
	const lifted = [];

	for (let i = 0; i < subpaths.length; i++) {
		const newPath = doc.createElementNS(
			'http://www.w3.org/2000/svg',
			'path'
		);

		copyElementAttributes(pathElement, newPath, PATH_D_ATTR_SKIP);
		newPath.setAttribute('d', subpaths[i]);
		parent.insertBefore(newPath, pathElement);
		lifted.push(newPath);
	}

	parent.removeChild(pathElement);

	return { ok: true, lifted, parent, kind: 'path' };
}

/**
 * Split a compound `<path>` into one path element per cluster (hole subpaths stay merged).
 *
 * @param {Element}   pathElement Path element to split.
 * @param {string[][]} clusters   Subpath data groups; each group becomes one `<path>`.
 * @return {{ ok: boolean, lifted?: Element[], parent?: Element, reason?: string, kind?: string }} Operation result.
 */
export function ungroupPathElementWithClusters(pathElement, clusters) {
	if (!pathElement?.parentElement) {
		return { ok: false, reason: 'no-parent' };
	}

	if (pathElement.nodeName.toLowerCase() !== 'path') {
		return { ok: false, reason: 'not-path' };
	}

	if (!clusters || clusters.length <= 1) {
		return { ok: false, reason: 'single-cluster' };
	}

	const parent = pathElement.parentElement;
	const doc = pathElement.ownerDocument;
	const lifted = [];

	for (let i = 0; i < clusters.length; i++) {
		const newPath = doc.createElementNS(
			'http://www.w3.org/2000/svg',
			'path'
		);

		copyElementAttributes(pathElement, newPath, PATH_D_ATTR_SKIP);
		newPath.setAttribute('d', clusters[i].join(' '));
		parent.insertBefore(newPath, pathElement);
		lifted.push(newPath);
	}

	parent.removeChild(pathElement);

	return { ok: true, lifted, parent, kind: 'path' };
}

/**
 * Lift group children to the parent and remove the empty wrapper `<g>`.
 * Combines the group transform into each child when present.
 *
 * @param {Element} group Group element to ungroup.
 * @return {{ ok: boolean, lifted?: Element[], parent?: Element, reason?: string, kind?: string }} Operation result.
 */
function ungroupGroupElement(group) {
	if (!group?.parentElement) {
		return { ok: false, reason: 'not-group' };
	}

	if (group.nodeName.toLowerCase() !== 'g') {
		return { ok: false, reason: 'not-group' };
	}

	const svg = group.ownerSVGElement;

	if (!svg) {
		return { ok: false, reason: 'no-svg' };
	}

	const parent = group.parentElement;
	const hasGroupTransform =
		group instanceof SVGGraphicsElement &&
		group.transform.baseVal.length > 0;
	const groupMatrix = hasGroupTransform
		? group.transform.baseVal.consolidate()?.matrix || svg.createSVGMatrix()
		: null;

	const lifted = [];
	const childNodes = [];

	for (let i = 0; i < group.childNodes.length; i++) {
		childNodes.push(group.childNodes[i]);
	}

	for (let i = 0; i < childNodes.length; i++) {
		const node = childNodes[i];

		if (node.nodeType !== 1) {
			continue;
		}

		const child = /** @type {Element} */ (node);

		if (
			hasGroupTransform &&
			groupMatrix &&
			child instanceof SVGGraphicsElement
		) {
			const childConsolidated = child.transform.baseVal.consolidate();
			const childMatrix = childConsolidated
				? childConsolidated.matrix
				: svg.createSVGMatrix();
			const combined = groupMatrix.multiply(childMatrix);
			const newTransform = svg.createSVGTransformFromMatrix(combined);

			child.transform.baseVal.initialize(newTransform);
		}

		parent.insertBefore(child, group);
		lifted.push(child);
	}

	if (!lifted.length) {
		return { ok: false, reason: 'empty-group' };
	}

	parent.removeChild(group);

	return { ok: true, lifted, parent, kind: 'group' };
}

/**
 * Lift group children and auto-split compound paths that are separate shapes.
 * Preserves merged hole compounds (nested rects) until the user selects that path.
 *
 * @param {Element} group Group element to ungroup.
 * @return {Promise<{ ok: boolean, lifted?: Element[], parent?: Element, reason?: string, kind?: string }>} Async operation result.
 */
export async function ungroupGroupElementAsync(group) {
	if (!group?.parentElement) {
		return { ok: false, reason: 'not-group' };
	}

	if (group.nodeName.toLowerCase() !== 'g') {
		return { ok: false, reason: 'not-group' };
	}

	const svg = group.ownerSVGElement;

	if (!svg) {
		return { ok: false, reason: 'no-svg' };
	}

	const parent = group.parentElement;
	const hasGroupTransform =
		group instanceof SVGGraphicsElement &&
		group.transform.baseVal.length > 0;
	const groupMatrix = hasGroupTransform
		? group.transform.baseVal.consolidate()?.matrix || svg.createSVGMatrix()
		: null;

	const lifted = [];
	const childNodes = [];

	for (let i = 0; i < group.childNodes.length; i++) {
		childNodes.push(group.childNodes[i]);
	}

	for (let i = 0; i < childNodes.length; i++) {
		const node = childNodes[i];

		if (node.nodeType !== 1) {
			continue;
		}

		const child = /** @type {Element} */ (node);

		if (
			hasGroupTransform &&
			groupMatrix &&
			child instanceof SVGGraphicsElement
		) {
			const childConsolidated = child.transform.baseVal.consolidate();
			const childMatrix = childConsolidated
				? childConsolidated.matrix
				: svg.createSVGMatrix();
			const combined = groupMatrix.multiply(childMatrix);
			const newTransform = svg.createSVGTransformFromMatrix(combined);

			child.transform.baseVal.initialize(newTransform);
		}

		parent.insertBefore(child, group);

		if (child.nodeName.toLowerCase() === 'path') {
			const split = await splitPathElement(child, { forceSplit: false });

			if (split.ok && split.clusters) {
				const splitResult = ungroupPathElementWithClusters(
					child,
					split.clusters
				);

				if (splitResult.ok && splitResult.lifted) {
					for (let j = 0; j < splitResult.lifted.length; j++) {
						lifted.push(splitResult.lifted[j]);
					}

					continue;
				}
			}
		}

		lifted.push(child);
	}

	if (!lifted.length) {
		return { ok: false, reason: 'empty-group' };
	}

	parent.removeChild(group);

	return { ok: true, lifted, parent, kind: 'group' };
}

/**
 * Ungroup a `<g>` wrapper or split a compound `<path>`.
 *
 * @param {Element} element Group or path element.
 * @return {{ ok: boolean, lifted?: Element[], parent?: Element, reason?: string, kind?: string }} Operation result.
 */
export function ungroupElement(element) {
	if (!element?.parentElement) {
		return { ok: false, reason: 'no-parent' };
	}

	const tag = element.nodeName.toLowerCase();

	if (tag === 'g') {
		return ungroupGroupElement(element);
	}

	return { ok: false, reason: 'unsupported' };
}

/**
 * Resolve which group should be ungrouped from selection or drill context.
 *
 * @param {Element | null}      selected Selected element.
 * @param {Element | null}      context  Current drill context.
 * @param {SVGSVGElement | null} rootSvg Root svg.
 * @return {Element | null} Matching element or null.
 */
export function getUngroupTarget(
	selected,
	context,
	rootSvg,
	pathCanUngroup = false
) {
	if (canUngroupElement(selected, rootSvg)) {
		return selected;
	}

	// Prefer ungrouping the drilled-in group over splitting a selected child path.
	if (context && context !== rootSvg && canUngroupElement(context, rootSvg)) {
		return context;
	}

	if (
		selected &&
		selected.nodeName.toLowerCase() === 'path' &&
		pathCanUngroup
	) {
		return selected;
	}

	return null;
}

/**
 * Whether ungroup is available for the current selection or drill context.
 *
 * @param {Element | null}         selected Selected element.
 * @param {Element | null}         context  Current drill context.
 * @param {SVGSVGElement | null} rootSvg  Root svg.
 * @param {boolean}                pathCanUngroup Whether selected path is splittable.
 * @return {boolean} Result of the check.
 */
export function canUngroupSelection(
	selected,
	context,
	rootSvg,
	pathCanUngroup = false
) {
	return Boolean(
		getUngroupTarget(selected, context, rootSvg, pathCanUngroup)
	);
}

/**
 * Clear selection/hover classes from all marked nodes under root.
 *
 * @param {Element} root Search root.
 */
export function clearEditorClasses(root) {
	if (!root) {
		return;
	}

	clearSelectionHighlights(root);

	const hoverable = root.querySelectorAll(`.${SVG_EDITOR_HOVER_CLASS}`);

	for (let i = 0; i < hoverable.length; i++) {
		hoverable[i].classList.remove(SVG_EDITOR_HOVER_CLASS);
	}
}

/**
 * Mark direct selectable children as hoverable.
 *
 * @param {Element} context Current drill context.
 */
export function markHoverableChildren(context) {
	const children = getDirectSelectableChildren(context);

	for (let i = 0; i < children.length; i++) {
		children[i].classList.add(SVG_EDITOR_HOVER_CLASS);
	}
}

/**
 * Apply an in-SVG highlight on the selected element so it reads above siblings.
 *
 * @param {Element | null} selected Selected SVG element.
 */
export function applySelectionHighlight(selected) {
	if (!selected) {
		return;
	}

	selected.classList.add(SVG_EDITOR_SELECTED_CLASS);

	if (!selected.hasAttribute('data-blockera-editor-highlight')) {
		selected.setAttribute('data-blockera-editor-highlight', 'true');
	}

	// Bring selected node to front within its parent so the highlight isn't covered.
	const parent = selected.parentElement;

	if (parent) {
		parent.appendChild(selected);
	}
}

/**
 * Apply in-SVG highlights for all selected elements.
 *
 * @param {Element[]} selectedElements Selected SVG elements.
 */
export function applySelectionHighlights(selectedElements) {
	if (!selectedElements?.length) {
		return;
	}

	for (let i = 0; i < selectedElements.length; i++) {
		applySelectionHighlight(selectedElements[i]);
	}
}

/**
 * Remove in-SVG highlight attributes/classes from all nodes under root.
 *
 * @param {Element} root Search root.
 */
export function clearSelectionHighlights(root) {
	if (!root) {
		return;
	}

	const highlighted = root.querySelectorAll(
		`[data-blockera-editor-highlight], .${SVG_EDITOR_SELECTED_CLASS}`
	);

	for (let i = 0; i < highlighted.length; i++) {
		const node = highlighted[i];
		node.classList.remove(SVG_EDITOR_SELECTED_CLASS);
		node.removeAttribute('data-blockera-editor-highlight');
	}
}

/**
 * Copy attributes from source to target, optionally skipping keys.
 *
 * @param {Element}        source       Source element.
 * @param {Element}        target       Target element.
 * @param {Set<string>}    skipAttrs    Attribute names to skip.
 */
export function copyElementAttributes(source, target, skipAttrs) {
	if (!source?.attributes) {
		return;
	}

	for (let i = 0; i < source.attributes.length; i++) {
		const attr = source.attributes[i];
		const name = attr.name.toLowerCase();

		if (skipAttrs.has(name)) {
			continue;
		}

		target.setAttribute(attr.name, attr.value);
	}
}

/**
 * Materialize inherited stroke-icon paint attrs on shapes for stable editor rendering.
 *
 * @param {SVGSVGElement | null} rootSvg Root SVG element.
 */
export function materializeStrokeIconPresentation(rootSvg) {
	if (!rootSvg || rootSvg.nodeName.toLowerCase() !== 'svg') {
		return;
	}

	let markup = '';

	try {
		markup = new XMLSerializer().serializeToString(rootSvg);
	} catch (error) {
		return;
	}

	if (!isStrokeSvgMarkup(markup)) {
		return;
	}

	const rootFill = rootSvg.getAttribute('fill') || 'none';
	const rootStroke = rootSvg.getAttribute('stroke') || 'currentColor';
	const rootStrokeWidth = rootSvg.getAttribute('stroke-width');
	const shapes = rootSvg.querySelectorAll(
		'path, rect, circle, ellipse, line, polyline, polygon'
	);

	for (let i = 0; i < shapes.length; i++) {
		const node = shapes[i];

		if (isInsideExcludedContainer(node)) {
			continue;
		}

		if (isSvgFillAccentElement(node)) {
			// Native stroke icons: accent dots inherit root stroke (r=.5 reads larger).
			if (!node.hasAttribute('stroke') && rootStroke) {
				node.setAttribute('stroke', rootStroke);
			}

			if (rootStrokeWidth && !node.hasAttribute('stroke-width')) {
				node.setAttribute('stroke-width', rootStrokeWidth);
			}

			continue;
		}

		if (!node.hasAttribute('fill')) {
			node.setAttribute('fill', rootFill);
		}

		if (!node.hasAttribute('stroke')) {
			node.setAttribute('stroke', rootStroke);
		}

		if (rootStrokeWidth && !node.hasAttribute('stroke-width')) {
			node.setAttribute('stroke-width', rootStrokeWidth);
		}
	}
}
