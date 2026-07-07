// @flow

/**
 * Default BlockType flags (see packages/blocks-core/js/type/index.js).
 */
export const DEFAULT_HAS_STYLE_VARIATIONS = true;
export const DEFAULT_HAS_SIZE_VARIATIONS = false;

export type BlockVariationSupport = {|
	hasStyleVariations: boolean,
	hasSizeVariations: boolean,
|};

/**
 * Resolves style/size variation UI flags from a registered Blockera block extension.
 *
 * @param {?Object} blockExtension Registered extension from blockera/extensions store.
 * @return {BlockVariationSupport} Resolved flags with defaults when omitted on the extension.
 */
export function getBlockVariationSupport(
	blockExtension?: Object | null
): BlockVariationSupport {
	return {
		hasStyleVariations:
			blockExtension?.hasStyleVariations ?? DEFAULT_HAS_STYLE_VARIATIONS,
		hasSizeVariations:
			blockExtension?.hasSizeVariations ?? DEFAULT_HAS_SIZE_VARIATIONS,
	};
}

/**
 * @param {string} blockName WordPress block name (e.g. core/button).
 * @param {Function} getBlockExtensionBy blockera/extensions selector.
 * @return {BlockVariationSupport} Flags for the extension registered to the given block name.
 */
export function getBlockVariationSupportForBlock(
	blockName: string,
	getBlockExtensionBy: (field: string, value: string) => Object | void
): BlockVariationSupport {
	return getBlockVariationSupport(
		getBlockExtensionBy('targetBlock', blockName)
	);
}

/**
 * Whether the given variation surface should render UI for this block.
 */
export function isVariationSurfaceEnabled(
	variationSurface: string,
	support: BlockVariationSupport,
	styleSurface: string,
	sizeSurface: string
): boolean {
	if (variationSurface === sizeSurface) {
		return support.hasSizeVariations;
	}

	if (variationSurface === styleSurface) {
		return support.hasStyleVariations;
	}

	return support.hasStyleVariations;
}

/**
 * Blocks with size variations use the block root (`styles.blocks.{block}`) as the
 * shared default/main variation for both style and size surfaces.
 */
export function blockUsesSharedRootStyleVariation(
	support: BlockVariationSupport
): boolean {
	return support.hasSizeVariations === true;
}
