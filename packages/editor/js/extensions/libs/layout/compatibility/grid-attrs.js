// @flow

/**
 * Sync WordPress `layout.minimumColumnWidth` / `layout.columnCount` into Blockera attrs when layout type is grid.
 */
export function gridAttrsFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	const layout = attributes?.layout;
	if (!layout || typeof layout !== 'object' || layout.type !== 'grid') {
		return attributes;
	}

	if ('minimumColumnWidth' in layout) {
		const m = layout.minimumColumnWidth;
		attributes.blockeraGridMinimumColumnWidth = {
			value: typeof m === 'string' ? m : '',
		};
	}

	if ('columnCount' in layout) {
		const c = layout.columnCount;
		let value: number | string = '';
		if (typeof c === 'number' && c > 0) {
			value = c;
		} else if (c !== '' && c !== undefined && c !== null) {
			const n = parseInt(String(c), 10);
			if (Number.isFinite(n) && n > 0) {
				value = n;
			}
		}
		attributes.blockeraGridColumnCount = { value };
	}

	return attributes;
}

/**
 * Merge Blockera grid attrs into core `layout` for blocks that store layout on the block.
 *
 * @param {Object} nextLayout Partial or full layout object to merge onto existing.
 * @param {Object} currentAttributes Current block attributes (must include layout if present).
 * @return {Object} Attributes patch containing merged `layout` object.
 */
function mergeLayoutPatch(
	nextLayout: Object,
	currentAttributes: Object
): Object {
	const existing =
		currentAttributes?.layout &&
		typeof currentAttributes.layout === 'object'
			? { ...currentAttributes.layout }
			: {};

	const merged = { ...existing, ...nextLayout };
	for (const k of Object.keys(nextLayout)) {
		if (nextLayout[k] === undefined) {
			delete merged[k];
		}
	}

	return {
		layout: merged,
	};
}

/**
 * setAttributes filter passes the raw control value (string/number), while some
 * call sites use { value }. Support both shapes for WP layout sync.
 */
export function getBlockeraAttrPayloadValue(newValue: mixed): mixed {
	if (newValue && typeof newValue === 'object' && 'value' in newValue) {
		return newValue.value;
	}

	return newValue;
}

/**
 * @param {Object} params
 * @return {?Object} Layout patch for `core/group`, or null when not applicable.
 */
export function gridMinimumColumnWidthToWPCompatibility({
	newValue,
	blockId,
	getAttributes,
}: {
	newValue: mixed,
	blockId: string,
	getAttributes: () => Object,
}): ?Object {
	if (blockId !== 'core/group') {
		return null;
	}

	const attrs = getAttributes();
	const v = getBlockeraAttrPayloadValue(newValue);
	const min = typeof v === 'string' ? v : '';
	const patch = mergeLayoutPatch(
		{
			type: 'grid',
			minimumColumnWidth: min === '' ? undefined : min,
		},
		attrs
	);

	return patch;
}

/**
 * @param {Object} params
 * @return {?Object} Layout patch for `core/group`, or null when not applicable.
 */
export function gridColumnCountToWPCompatibility({
	newValue,
	blockId,
	getAttributes,
}: {
	newValue: mixed,
	blockId: string,
	getAttributes: () => Object,
}): ?Object {
	if (blockId !== 'core/group') {
		return null;
	}

	const attrs = getAttributes();
	const raw = getBlockeraAttrPayloadValue(newValue);
	let columnCount;
	if (raw === '' || raw === undefined || raw === null) {
		columnCount = undefined;
	} else {
		const n = typeof raw === 'number' ? raw : parseInt(String(raw), 10);
		columnCount = Number.isFinite(n) && n > 0 ? n : undefined;
	}

	const patch = mergeLayoutPatch(
		{
			type: 'grid',
			columnCount,
		},
		attrs
	);

	return patch;
}
