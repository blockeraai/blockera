// @flow

/**
 * Internal dependencies
 */
import { getBlockeraAttrPayloadValue } from '../../layout/compatibility/grid-attrs';

function spanAttrIsEmpty(attr: mixed): boolean {
	if (attr === null || attr === undefined) {
		return true;
	}
	const v =
		typeof attr === 'object' && attr !== null && 'value' in attr
			? attr.value
			: attr;
	return v === '' || v === undefined || v === null;
}

/**
 * Merge child layout keys into `attributes.style.layout` (WordPress core
 * `style.layout.columnSpan` / `rowSpan` on grid children).
 */
function mergeStyleLayoutPatch(
	nextLayout: Object,
	currentAttributes: Object
): Object {
	const style =
		currentAttributes?.style && typeof currentAttributes.style === 'object'
			? { ...currentAttributes.style }
			: {};
	const existing =
		style.layout && typeof style.layout === 'object'
			? { ...style.layout }
			: {};

	const merged = { ...existing, ...nextLayout };
	for (const k of Object.keys(nextLayout)) {
		if (nextLayout[k] === undefined) {
			delete merged[k];
		}
	}

	return {
		style: {
			...style,
			layout: merged,
		},
	};
}

/**
 * Hydrate Blockera grid-child attrs from core `style.layout` when Blockera
 * values are still default (mirrors spacing compat pattern).
 */
export function gridChildSpansFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	const childLayout = attributes?.style?.layout;
	if (!childLayout || typeof childLayout !== 'object') {
		return attributes;
	}

	if (
		'columnSpan' in childLayout &&
		childLayout.columnSpan !== undefined &&
		childLayout.columnSpan !== null &&
		childLayout.columnSpan !== '' &&
		spanAttrIsEmpty(attributes.blockeraGridChildColumnSpan)
	) {
		const n = parseInt(String(childLayout.columnSpan), 10);
		if (Number.isFinite(n) && n > 0) {
			attributes.blockeraGridChildColumnSpan = { value: n };
		}
	}

	if (
		'rowSpan' in childLayout &&
		childLayout.rowSpan !== undefined &&
		childLayout.rowSpan !== null &&
		childLayout.rowSpan !== '' &&
		spanAttrIsEmpty(attributes.blockeraGridChildRowSpan)
	) {
		const n = parseInt(String(childLayout.rowSpan), 10);
		if (Number.isFinite(n) && n > 0) {
			attributes.blockeraGridChildRowSpan = { value: n };
		}
	}

	return attributes;
}

/**
 * @return {Object} Patch for `attributes.style.layout.columnSpan`.
 */
export function gridChildColumnSpanToWPCompatibility({
	newValue,
	getAttributes,
}: {
	newValue: mixed,
	getAttributes: () => Object,
}): Object {
	const attrs = getAttributes();
	const raw = getBlockeraAttrPayloadValue(newValue);
	let columnSpan;
	if (raw === '' || raw === undefined || raw === null) {
		columnSpan = undefined;
	} else {
		const n = typeof raw === 'number' ? raw : parseInt(String(raw), 10);
		columnSpan = Number.isFinite(n) && n > 0 ? n : undefined;
	}

	return mergeStyleLayoutPatch({ columnSpan }, attrs);
}

/**
 * @return {Object} Patch for `attributes.style.layout.rowSpan`.
 */
export function gridChildRowSpanToWPCompatibility({
	newValue,
	getAttributes,
}: {
	newValue: mixed,
	getAttributes: () => Object,
}): Object {
	const attrs = getAttributes();
	const raw = getBlockeraAttrPayloadValue(newValue);
	let rowSpan;
	if (raw === '' || raw === undefined || raw === null) {
		rowSpan = undefined;
	} else {
		const n = typeof raw === 'number' ? raw : parseInt(String(raw), 10);
		rowSpan = Number.isFinite(n) && n > 0 ? n : undefined;
	}

	return mergeStyleLayoutPatch({ rowSpan }, attrs);
}
