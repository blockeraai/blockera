// @flow

/**
 * External dependencies
 */
import { _x } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { VARIATION_SURFACE_SIZE } from './variation-surfaces';

/** CSS class prefix applied to the block for Blockera **size** variations (`is-size-{slug}`). */
export const BLOCK_SIZE_VARIATION_CLASS_PREFIX = 'is-size-';

/** theme.json key on `styles.blocks.{block}` declaring size variation display order. */
export const BLOCK_SIZE_VARIATIONS_ORDER_KEY = 'blockeraSizeVariationsOrder';

/**
 * Resolve a variation slug to its index in {@param order}.
 * Prefers the segment after the last `-size-` in the slug, otherwise the full slug.
 */
export function getSizeVariationSortIndex(
	slug: mixed,
	order: Array<string>
): number {
	if (typeof slug !== 'string' || !slug || !order?.length) {
		return order?.length ?? 0;
	}

	const normalizedSlug = slug.toLowerCase();
	const sizeTokenMatch = normalizedSlug.match(/-size-(.+)$/);
	const sizeToken = sizeTokenMatch ? sizeTokenMatch[1] : normalizedSlug;
	const index = order.findIndex(
		(token) => String(token).toLowerCase() === sizeToken
	);

	return index === -1 ? order.length : index;
}

/** Sort size rows: synthetic `default` row first, then theme order, then unknown slugs. */
export function sortSizeVariationRowsByOrder(
	rows: Array<Object>,
	order?: Array<string>
): Array<Object> {
	if (!order || order.length === 0) {
		return rows || [];
	}

	return [...(rows || [])].sort((a, b) => {
		const aIsSyntheticDefault = a?.name === 'default';
		const bIsSyntheticDefault = b?.name === 'default';

		if (aIsSyntheticDefault) {
			return -1;
		}
		if (bIsSyntheticDefault) {
			return 1;
		}

		const aIndex = getSizeVariationSortIndex(a?.name, order);
		const bIndex = getSizeVariationSortIndex(b?.name, order);

		if (aIndex !== bIndex) {
			return aIndex - bIndex;
		}

		return String(a?.name || '').localeCompare(String(b?.name || ''));
	});
}

/**
 * Reads `styles.blocks.{block}.blockeraSizeVariationsOrder` from theme global styles.
 * User edits override theme base.
 */
export function getBlockSizeVariationsOrder(
	baseConfig: Object,
	userConfig: Object,
	blockName: string
): Array<string> | void {
	const normalize = (value: mixed): Array<string> | void => {
		if (!Array.isArray(value) || value.length === 0) {
			return undefined;
		}

		const tokens: Array<string> = [];

		for (const token of value) {
			if (typeof token !== 'string') {
				continue;
			}

			const trimmed = token.trim();

			if (trimmed) {
				tokens.push(trimmed);
			}
		}

		return tokens.length > 0 ? tokens : undefined;
	};

	return (
		normalize(
			userConfig?.styles?.blocks?.[blockName]?.[
				BLOCK_SIZE_VARIATIONS_ORDER_KEY
			]
		) ||
		normalize(
			baseConfig?.styles?.blocks?.[blockName]?.[
				BLOCK_SIZE_VARIATIONS_ORDER_KEY
			]
		)
	);
}

/**
 * Deep-merge `styles.blocks[blockName].variations` from base + user theme.json data.
 */
export function mergeBlockVariationsTrees(
	baseConfig: Object,
	userConfig: Object,
	blockName: string
): Object {
	const baseV: Object =
		baseConfig?.styles?.blocks?.[blockName]?.variations ?? {};
	const userV: Object =
		userConfig?.styles?.blocks?.[blockName]?.variations ?? {};
	const slugs: Set<string> = new Set([
		...Object.keys(baseV),
		...Object.keys(userV),
	]);
	const merged: Object = {};

	for (const slug of slugs) {
		merged[slug] = mergeObject(baseV[slug] || {}, userV[slug] || {});
	}

	return merged;
}

export function isSizeVariationEntry(data: mixed): boolean {
	return (
		data !== null &&
		typeof data === 'object' &&
		// $FlowFixMe
		data.blockeraVariationType === VARIATION_SURFACE_SIZE
	);
}

/**
 * Ensures persisted theme.json variation entries for the size surface always carry Blockera metadata.
 */
export function attachSizeVariationPersistenceKeys(
	normalized: Object,
	slug: string,
	mergedVariations: Object
): Object {
	const prev: Object = mergedVariations[slug] || {};

	return {
		...normalized,
		blockeraVariationType: VARIATION_SURFACE_SIZE,
		blockeraIsDefaultVariation:
			typeof prev.blockeraIsDefaultVariation === 'boolean'
				? prev.blockeraIsDefaultVariation
				: false,
	};
}

/** Synthetic default row when no theme.json size default exists (mirrors style surface). */
export function createDefaultSizeVariationRow(): Object {
	return {
		name: 'default',
		label: _x('Default', 'block size variation', 'blockera'),
		isDefault: true,
		icon: {
			name: 'wordpress',
			library: 'wp',
		},
	};
}

/** Root variation: edits target `styles.blocks.{block}` instead of `variations.{slug}`. */
export function isRootVariation(currentStyle: mixed): boolean {
	if (!currentStyle || typeof currentStyle !== 'object') {
		return true;
	}

	// $FlowFixMe
	return !currentStyle.name || currentStyle.isDefault === true;
}

/**
 * True when the user explicitly picked the root/default variation row (not merely
 * "no selection"). Empty context state must stay false so variation lists render.
 */
export function isEphemeralDefaultSizeVariation(currentStyle: mixed): boolean {
	if (!currentStyle || typeof currentStyle !== 'object') {
		return false;
	}

	// $FlowFixMe
	return currentStyle.isDefault === true;
}

/** Slug of the theme.json size variation marked as the shared block root default. */
export function findSharedRootVariationSlug(
	mergedVariations: Object
): string | null {
	for (const [slug, data] of Object.entries(mergedVariations || {})) {
		if (
			isSizeVariationEntry(data) &&
			// $FlowFixMe
			data.blockeraIsDefaultVariation === true
		) {
			return slug;
		}
	}

	return null;
}

/**
 * When {@see blockUsesSharedRootStyleVariation}, both surfaces treat `isDefault`
 * rows as root block styles. Style-only blocks keep the style-surface default rules.
 */
export function shouldEditBlockRootForVariation(
	currentStyle: mixed,
	usesSharedRootStyleVariation: boolean
): boolean {
	if (usesSharedRootStyleVariation) {
		return isRootVariation(currentStyle);
	}

	if (!currentStyle || typeof currentStyle !== 'object') {
		return true;
	}

	// $FlowFixMe
	return !currentStyle.name || currentStyle.isDefault === true;
}

/** Inverse of {@see shouldEditBlockRootForVariation} — edits go under `variations.{slug}`. */
export function isVariationScopedStyleEdit(
	currentStyle: mixed,
	usesSharedRootStyleVariation: boolean
): boolean {
	if (!currentStyle || typeof currentStyle !== 'object') {
		return false;
	}

	// $FlowFixMe
	if (!currentStyle.name) {
		return false;
	}

	return !shouldEditBlockRootForVariation(
		currentStyle,
		usesSharedRootStyleVariation
	);
}

/**
 * Style-surface rows for blocks with shared root: keep the default row on root and
 * attach the theme.json default slug for metadata/rename when present.
 */
export function alignStyleRowsWithSharedRootVariation(
	rows: Array<Object>,
	mergedVariations: Object,
	usesSharedRootStyleVariation: boolean
): Array<Object> {
	if (!usesSharedRootStyleVariation) {
		return rows;
	}

	const sharedRootSlug = findSharedRootVariationSlug(mergedVariations);

	return (rows || []).map((row) => {
		if (!row?.isDefault) {
			return row;
		}

		if (!sharedRootSlug) {
			return row;
		}

		return {
			...row,
			sharedRootSlug,
			blockeraIsDefaultVariation: true,
		};
	});
}

/**
 * Normalize size rows: map theme.json `blockeraIsDefaultVariation` → `isDefault`,
 * ensure a default row exists, sort by {@param sizeVariationOrder}.
 */
export function normalizeSizeVariationRows(
	rows: Array<Object>,
	usesSharedRootStyleVariation: boolean = true,
	sizeVariationOrder?: Array<string>
): Array<Object> {
	let normalized = (rows || []).map((row) => {
		if (row.blockeraIsDefaultVariation === true || row.isDefault) {
			return { ...row, isDefault: true };
		}

		return row;
	});

	normalized = sortSizeVariationRowsByOrder(normalized, sizeVariationOrder);

	if (
		usesSharedRootStyleVariation &&
		!normalized.some((row) => row.isDefault)
	) {
		normalized = [createDefaultSizeVariationRow(), ...normalized];
	}

	return normalized;
}
