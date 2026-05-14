// @flow

/**
 * Shared filtering for theme.json block variation surfaces (style vs size).
 * Used by block inspector hooks and the global-styles panel shell.
 */

import {
	VARIATION_SURFACE_SIZE,
	VARIATION_SURFACE_STYLE,
} from './panel/variation-surfaces';
import {
	mergeBlockVariationsTrees,
	isSizeVariationEntry,
	BLOCK_SIZE_VARIATION_CLASS_PREFIX,
} from './panel/size-variations';

export {
	mergeBlockVariationsTrees,
	isSizeVariationEntry,
	BLOCK_SIZE_VARIATION_CLASS_PREFIX,
};

/**
 * WP/block-editor style rows filtered for the style surface (excludes Blockera size variations).
 */
export function filterRenderedStylesExcludingSizes(
	stylesToRender: Array<Object>,
	mergedVariationsBySlug: Object
): Array<Object> {
	return stylesToRender.filter(
		(s) =>
			!mergedVariationsBySlug[s.name] ||
			!isSizeVariationEntry(mergedVariationsBySlug[s.name])
	);
}

/**
 * WP/block-editor style rows filtered for the size surface (only Blockera size variations).
 */
export function filterRenderedStylesIncludingOnlySizes(
	stylesToRender: Array<Object>,
	mergedVariationsBySlug: Object
): Array<Object> {
	return stylesToRender.filter(
		(s) =>
			mergedVariationsBySlug[s.name] &&
			isSizeVariationEntry(mergedVariationsBySlug[s.name])
	);
}

/**
 * Discriminates rendered style rows by {@see VARIATION_SURFACE_STYLE} vs {@see VARIATION_SURFACE_SIZE}.
 * Unknown surfaces pass through unchanged.
 */
export function filterRenderedStylesForVariationSurface(
	stylesToRender: Array<Object>,
	mergedVariationsBySlug: Object,
	variationSurface: string
): Array<Object> {
	switch (variationSurface) {
		case VARIATION_SURFACE_STYLE:
			return filterRenderedStylesExcludingSizes(
				stylesToRender,
				mergedVariationsBySlug
			);
		case VARIATION_SURFACE_SIZE:
			return filterRenderedStylesIncludingOnlySizes(
				stylesToRender,
				mergedVariationsBySlug
			);
		default:
			return stylesToRender;
	}
}

/** True when merged theme.json variations include at least one size variation for the block. */
export function mergedBlockVariationsHasSizeEntry(
	mergedVariationsBySlug: Object
): boolean {
	for (const key of Object.keys(mergedVariationsBySlug)) {
		if (isSizeVariationEntry(mergedVariationsBySlug[key])) {
			return true;
		}
	}
	return false;
}

/** True when merged theme.json variations include at least one non-size slug for the block. */
export function mergedBlockVariationsHasNonSizeEntry(
	mergedVariationsBySlug: Object
): boolean {
	for (const key of Object.keys(mergedVariationsBySlug)) {
		if (!isSizeVariationEntry(mergedVariationsBySlug[key])) {
			return true;
		}
	}
	return false;
}

/**
 * Reads theme base + edited global-styles entity from `@wordpress/data` core store.
 * Shared by inspector variation hooks and {@see BlockGlobalStylesPanelScreen}.
 */
export function getThemeVariationConfigsFromCoreStore(select: Function): {
	baseConfig: Object,
	userConfig: Object,
} {
	const core = select('core');
	const globalStylesId =
		typeof core.__experimentalGetCurrentGlobalStylesId === 'function'
			? core.__experimentalGetCurrentGlobalStylesId()
			: null;
	let userCfg = {};
	if (globalStylesId) {
		const rec = core.getEditedEntityRecord(
			'root',
			'globalStyles',
			globalStylesId
		);
		if (rec && typeof rec === 'object') {
			userCfg = rec;
		}
	}
	const baseCfg =
		typeof core.__experimentalGetCurrentThemeBaseGlobalStyles === 'function'
			? core.__experimentalGetCurrentThemeBaseGlobalStyles() || {}
			: {};
	return { baseConfig: baseCfg, userConfig: userCfg };
}
