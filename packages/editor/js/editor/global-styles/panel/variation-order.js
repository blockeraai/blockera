// @flow

/**
 * Internal dependencies
 */
import {
	VARIATION_SURFACE_SIZE,
	VARIATION_SURFACE_STYLE,
} from './variation-surfaces';

/** Metadata key on `blockeraGlobalStylesMetaData.blocks.{block}`. */
export const VARIATION_ORDER_META_KEY = 'variationOrder';

/**
 * User-defined slug order saved from drag/drop in the global styles panel.
 */
export function getStoredVariationOrder(
	blockName: string,
	variationSurface: string,
	metaData?: Object | null
): Array<string> | void {
	const surfaceKey =
		variationSurface === VARIATION_SURFACE_SIZE
			? VARIATION_SURFACE_SIZE
			: VARIATION_SURFACE_STYLE;

	const order =
		metaData?.blocks?.[blockName]?.[VARIATION_ORDER_META_KEY]?.[surfaceKey];

	if (!Array.isArray(order) || order.length === 0) {
		return undefined;
	}

	const slugs: Array<string> = [];

	for (const slug of order) {
		if (typeof slug !== 'string') {
			continue;
		}

		const trimmed = slug.trim();

		if (trimmed) {
			slugs.push(trimmed);
		}
	}

	return slugs.length > 0 ? slugs : undefined;
}

/** Slugs from rendered rows in list order. */
export function buildVariationOrderFromRows(
	rows: Array<Object>
): Array<string> {
	return (rows || [])
		.map((row) => row?.name)
		.filter((name) => typeof name === 'string' && name);
}

/**
 * Sort variation rows by persisted slug order.
 * Unknown slugs append at the end.
 */
export function sortVariationRowsBySlugOrder(
	rows: Array<Object>,
	slugOrder?: Array<string>
): Array<Object> {
	if (!slugOrder || slugOrder.length === 0) {
		return rows || [];
	}

	const orderMap: Map<string, number> = new Map(
		slugOrder.map((slug, index) => [slug, index])
	);

	return [...(rows || [])].sort((a, b) => {
		const aIndex: number = orderMap.has(a?.name)
			? // $FlowFixMe[incompatible-type]
				orderMap.get(a.name)
			: slugOrder.length;
		const bIndex: number = orderMap.has(b?.name)
			? // $FlowFixMe[incompatible-type]
				orderMap.get(b.name)
			: slugOrder.length;

		if (aIndex !== bIndex) {
			return aIndex - bIndex;
		}

		return String(a?.name || '').localeCompare(String(b?.name || ''));
	});
}

/** Merge user slug order into blockera global styles metadata. */
export function mergeVariationOrderIntoMetaData(
	metaData: Object,
	blockName: string,
	variationSurface: string,
	slugOrder: Array<string>
): Object {
	const blockEntry = {
		...(metaData?.blocks?.[blockName] || {}),
	};
	const orderEntry = {
		...(blockEntry[VARIATION_ORDER_META_KEY] || {}),
	};

	if (variationSurface === VARIATION_SURFACE_SIZE) {
		orderEntry[VARIATION_SURFACE_SIZE] = slugOrder;
	} else {
		orderEntry[VARIATION_SURFACE_STYLE] = slugOrder;
	}

	blockEntry[VARIATION_ORDER_META_KEY] = orderEntry;

	return {
		...metaData,
		blocks: {
			...(metaData?.blocks || {}),
			[blockName]: blockEntry,
		},
	};
}
