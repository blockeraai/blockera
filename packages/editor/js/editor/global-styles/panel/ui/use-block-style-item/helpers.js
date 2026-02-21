// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select, dispatch } from '@wordpress/data';
import { registerBlockStyle, unregisterBlockStyle } from '@wordpress/blocks';
import { mergeObject, cloneObject } from '@blockera/utils';

const EDITOR_STORE = 'blockera/editor';

/**
 * Get block types for a style from the editor store.
 * Works outside global styles panel (context may return [] when not in panel).
 * Shared by handleOnRename and handleOnDuplicate.
 *
 * @param {string} blockName - Primary block name.
 * @param {string} styleName - Style variation name.
 * @return {Array<string>} - Block types that have this style.
 */
export const getBlockTypesForStyleFromStore = (
	blockName: string,
	styleName: string
): Array<string> =>
	getBlockTypesForStyle(
		blockName,
		select(EDITOR_STORE).getStyleVariationBlocks,
		styleName
	);

/**
 * Register a style for each block type. Shared by handleOnRename and handleOnDuplicate.
 *
 * @param {Array<string>} blockTypes - Block types to register.
 * @param {Object} styleObject - Style object (name, label, icon, ...).
 */
export const registerStyleForBlockTypes = (
	blockTypes: Array<string>,
	styleObject: Object
): void => {
	blockTypes.forEach((blockType) =>
		registerBlockStyle(blockType, styleObject)
	);
};

/**
 * Unregister a style from each block type. Used by handleOnRename.
 *
 * @param {Array<string>} blockTypes - Block types to unregister.
 * @param {string} styleName - Style variation name.
 */
export const unregisterStyleFromBlockTypes = (
	blockTypes: Array<string>,
	styleName: string
): void => {
	blockTypes.forEach((blockType) =>
		unregisterBlockStyle(blockType, styleName)
	);
};

/**
 * Set style variation blocks in the editor store.
 * Works outside global styles panel. Shared by handleOnRename and handleOnDuplicate.
 *
 * @param {string} styleName - Style variation name.
 * @param {Array<string>} blockTypes - Block types for this style.
 */
export const setStyleVariationBlocksInStore = (
	styleName: string,
	blockTypes: Array<string>
): void => {
	const fn = dispatch(EDITOR_STORE).setStyleVariationBlocks;
	if (fn) {
		fn(styleName, blockTypes, 'manual');
	}
};

/**
 * Clear style variation blocks for a style in the editor store. Used by handleOnRename.
 *
 * @param {string} styleName - Style variation name.
 */
export const clearStyleVariationBlocksInStore = (styleName: string): void => {
	setStyleVariationBlocksInStore(styleName, []);
};

/**
 * Get merged and normalized style values from base + user config for a given style.
 * Shared by handleOnRename, handleOnDuplicate, and similar flows.
 *
 * @param {Object} base - Base theme global styles.
 * @param {Object} globalStyles - User global styles.
 * @param {string} blockName - Block type name.
 * @param {Object} currentStyle - Style object (with name) to get values for.
 * @param {Object} styles - Panel styles object (merged with values).
 * @param {Object} defaultStyles - Default styles for normalization.
 * @param {Function} getNormalizedStyle - Normalizer (newStyle, defaultStyles) => Object.
 * @return {Object} - Normalized style values ready for globalStyles storage.
 */
export const getMergedNormalizedStyleFromSources = (
	base: Object,
	globalStyles: Object,
	blockName: string,
	currentStyle: Object,
	styles: Object,
	defaultStyles: Object,
	getNormalizedStyle: (Object, Object) => Object
): Object => {
	const { baseValues, userValues } = getStyleValuesFromSources(
		base,
		globalStyles,
		blockName,
		currentStyle
	);
	const mergedValues = mergeObject(baseValues, userValues);
	return getNormalizedStyle({ ...styles, ...mergedValues }, defaultStyles);
};

/**
 * Get style values from base theme and user global styles for a given block/style.
 *
 * @param {Object} base - Base theme global styles.
 * @param {Object} globalStyles - User global styles.
 * @param {string} blockName - Block type name.
 * @param {Object} currentStyle - Current style object (with name).
 * @return {{ baseValues: Object, userValues: Object }} - The style values from base theme and user global styles.
 */
export const getStyleValuesFromSources = (
	base: Object,
	globalStyles: Object,
	blockName: string,
	currentStyle: Object
): { baseValues: Object, userValues: Object } => {
	const baseValues = isRootStyle(currentStyle)
		? base?.styles?.blocks?.[blockName] || {}
		: base?.styles?.blocks?.[blockName]?.variations?.[currentStyle.name] ||
			{};
	const userValues = isRootStyle(currentStyle)
		? globalStyles?.blocks?.[blockName] || {}
		: globalStyles?.blocks?.[blockName]?.variations?.[currentStyle.name] ||
			{};
	return { baseValues, userValues };
};

/**
 * Build the blockera meta data update object for a single variation.
 * Merges variationData with existing variation - does NOT override other handlers' customizations.
 * Only the provided fields in variationData are updated; existing fields are preserved.
 *
 * @param {string} blockName - Block type name.
 * @param {string} styleName - Style variation name.
 * @param {Object} variationData - Data to merge for the variation (only these fields are updated).
 * @param {Object} existingMetaData - Existing blockera meta data to merge with.
 * @return {Object} - The blockera meta data update object with merged variation.
 */
export const buildVariationMetaDataUpdate = (
	blockName: string,
	styleName: string,
	variationData: Object,
	existingMetaData: Object = {}
): Object => {
	const existingVariation =
		existingMetaData?.blocks?.[blockName]?.variations?.[styleName] || {};
	const mergedVariation = mergeObject(existingVariation, variationData);

	return {
		blocks: {
			[blockName]: {
				variations: {
					[styleName]: mergedVariation,
				},
			},
		},
	};
};

/**
 * Get block types that should have a style registered (supports multiple blocks).
 *
 * @param {string} blockName - Primary block name.
 * @param {Function} getStyleVariationBlocks - Function to get blocks for a style.
 * @param {string} styleName - Style name.
 * @return {Array<string>} - The block types for the style.
 */
export const getBlockTypesForStyle = (
	blockName: string,
	getStyleVariationBlocks: ?(string) => Array<string>,
	styleName: string
): Array<string> => {
	const enabledBlockTypes =
		(getStyleVariationBlocks && getStyleVariationBlocks(styleName)) || [];
	return Array.isArray(enabledBlockTypes) && enabledBlockTypes.length > 0
		? enabledBlockTypes
		: [blockName];
};

/**
 * Build the blocks update object for global styles (for duplicate/register flow).
 *
 * @param {Array<string>} blockTypes - Block types to update.
 * @param {string} styleName - New style name.
 * @param {Object} normalizedStyle - Normalized style values.
 * @return {Object} - The blocks update object.
 */
export const buildBlocksUpdateForStyle = (
	blockTypes: Array<string>,
	styleName: string,
	normalizedStyle: Object
): Object =>
	blockTypes.reduce(
		(acc, blockType) => ({
			...acc,
			[blockType]: {
				variations: {
					[styleName]: normalizedStyle,
				},
			},
		}),
		{}
	);

/**
 * Remove a style variation from global styles object (mutates and returns).
 *
 * @param {Object} globalStyles - Global styles object (will be cloned).
 * @param {string} blockName - Block type name.
 * @param {Object} currentStyle - Style to remove (with name).
 * @return {Object} New global styles object.
 */
export const removeStyleVariationFromGlobalStyles = (
	globalStyles: Object,
	blockName: string,
	currentStyle: Object
): Object => {
	const newGlobalStyles = cloneObject(globalStyles);

	if (!isRootStyle(currentStyle)) {
		const variations = newGlobalStyles?.blocks?.[blockName]?.variations;
		if (variations?.[currentStyle.name]) {
			const variationCount = Object.keys(variations).length;
			if (variationCount === 1) {
				delete newGlobalStyles?.blocks?.[blockName]?.variations;
				if (
					!Object.keys(newGlobalStyles?.blocks?.[blockName] || {})
						.length
				) {
					delete newGlobalStyles?.blocks?.[blockName];
					if (!Object.keys(newGlobalStyles?.blocks || {}).length) {
						delete newGlobalStyles?.blocks;
					}
				}
			} else {
				delete newGlobalStyles?.blocks?.[blockName]?.variations?.[
					currentStyle.name
				];
			}
		}
	} else {
		const variations =
			newGlobalStyles?.blocks?.[blockName]?.variations || {};
		if (Object.keys(variations).length) {
			newGlobalStyles.blocks[blockName] = {
				variations: newGlobalStyles?.blocks?.[blockName]?.variations,
			};
		} else {
			delete newGlobalStyles?.blocks?.[blockName];
			if (!Object.keys(newGlobalStyles?.blocks || {}).length) {
				delete newGlobalStyles?.blocks;
			}
		}
	}

	return newGlobalStyles;
};

/**
 * Build blockera meta data update for duplicate style (blocks + variations).
 * Returns only the update object to merge - does NOT override other customizations.
 *
 * @param {string} blockName - Block type name.
 * @param {Object} duplicateStyle - New style object.
 * @param {Array<string>} blockTypesToRegister - Block types for the style.
 * @return {Object} - The blockera meta data update object to merge.
 */
export const buildDuplicateStyleMetaDataUpdate = (
	blockName: string,
	duplicateStyle: Object,
	blockTypesToRegister: Array<string>
): Object => ({
	blocks: {
		[blockName]: {
			variations: {
				[duplicateStyle.name]: {
					...duplicateStyle,
					enabledIn: blockTypesToRegister,
					disabledIn: [],
				},
			},
		},
	},
	variations: {
		[duplicateStyle.name]: {
			...duplicateStyle,
			enabledIn: blockTypesToRegister,
			disabledIn: [],
		},
	},
});

/**
 * Build blockera meta data for duplicate style (blocks + variations).
 * Merges with existing - does NOT override other customizations.
 *
 * @param {Object} existingMetaData - Existing blockera meta data.
 * @param {string} blockName - Block type name.
 * @param {Object} duplicateStyle - New style object.
 * @param {Array<string>} blockTypesToRegister - Block types for the style.
 * @return {Object} - The full merged blockera meta data.
 */
export const buildDuplicateStyleMetaData = (
	existingMetaData: Object,
	blockName: string,
	duplicateStyle: Object,
	blockTypesToRegister: Array<string>
): Object =>
	mergeObject(
		existingMetaData,
		buildDuplicateStyleMetaDataUpdate(
			blockName,
			duplicateStyle,
			blockTypesToRegister
		)
	);

export const getCalculatedNewStyle = ({
	action,
	blockStyles,
	currentStyle,
}: {
	styles: Object,
	currentStyle: Object,
	blockStyles: Array<Object>,
	action: 'duplicate' | 'add-new',
}): { name: string, label: string, icon: Object } => {
	// Get existing style names from both variations and blockStyles
	const existingStylesNames = blockStyles.map((style) => style.name);
	const existingStylesLabels = blockStyles.map((style) => style.label);

	// Base label for new style.
	const baseLabel =
		action === 'duplicate' && currentStyle.label
			? currentStyle.label.replace(/\s\(Copy(\s\d+|)\)$/, '')
			: __('Style', 'blockera');

	// Find first available number by checking existing style names.
	let number = blockStyles.length + 1;

	const existingNumbers = blockStyles
		.map((style) => {
			const match = style.name.match(/^style-(\d+)$/);
			return match ? parseInt(match[1]) : null;
		})
		.filter((num) => num !== null);

	// Find first gap in sequence or use next number.
	while (existingNumbers.includes(number)) {
		number++;
	}

	const baseName =
		'duplicate' === action && currentStyle.name
			? currentStyle.name.replace(/-copy(-?(\d+|))$/, '')
			: `style-${number}`;

	// Initial label attempt.
	let newLabel = baseLabel;
	let newName = baseName;
	let counter = 1;

	// Keep incrementing counter until we find unused name.
	while (true) {
		const testLabel =
			action === 'duplicate'
				? `${baseLabel} (Copy${1 === counter ? '' : ` ${counter - 1}`})`
				: `${baseLabel} ${counter}`;

		const testName =
			'duplicate' === action
				? `${baseName}-copy${1 === counter ? '' : `-${counter - 1}`}`
				: `${baseName}-${counter}`;

		if (
			!existingStylesNames.includes(testName) &&
			!existingStylesLabels.includes(testLabel)
		) {
			newLabel = testLabel;
			newName = testName;
			break;
		}
		counter++;
	}

	return {
		name: newName,
		label: newLabel,
		icon: {
			name: 'blockera',
			library: 'blockera',
		},
	};
};

export const blockHasStyle = (blockName: string, style: string): boolean => {
	const { getBlockStyles } = select('core/blocks');
	const blockStyles = getBlockStyles(blockName);

	return blockStyles.some((blockStyle) => blockStyle.name === style);
};

export const isRootStyle = (currentStyle: Object): boolean => {
	return (
		!currentStyle?.name ||
		('default' === currentStyle.name &&
			'wordpress' === currentStyle?.icon?.name)
	);
};

/**
 * Mark a style variation as deleted in blockera metadata.
 * Shared logic for handleOnDelete and handleOnRename.
 *
 * - Blockera-created: remove variation entirely from metadata.
 * - From block/theme/core: set isDeleted: true for rendering requirements.
 *
 * @param {Object} blockeraMetaData - Current blockera metadata.
 * @param {string} blockName - Block type name.
 * @param {string} styleName - Style variation name to mark as deleted.
 * @param {Object} styleFallback - Fallback style object when creating new metadata entry.
 * @param {Object} baseConfig - Base theme global styles (for isBlockeraCreatedStyle).
 * @return {Object} - Updated blockera metadata (cloned, not mutated).
 */
/**
 * Build metadata updates to assign old style's blockeraMetaData to new style name.
 * Used when renaming with isConfirmedChangeID: copy blocks.*.variations and variations.
 *
 * @param {Object} blockeraMetaData - Current blockera metadata.
 * @param {string} blockName - Primary block name.
 * @param {string} oldStyleName - Previous style variation name.
 * @param {string} newStyleName - New style variation name.
 * @param {Array<string>} blockTypesToRegister - Block types that use this style.
 * @param {Object} mergedVariation - Merged variation for primary block.
 * @return {Object} - { blocks: {...}, variations: {...} } to merge into metadata.
 */
export const buildMetadataTransferForRenamedStyle = (
	blockeraMetaData: Object,
	blockName: string,
	oldStyleName: string,
	newStyleName: string,
	blockTypesToRegister: Array<string>,
	mergedVariation: Object
): Object => {
	const blocksUpdate: { [string]: Object } = {};
	const oldGlobalVariation =
		blockeraMetaData?.variations?.[oldStyleName] || {};
	const identityUpdate = {
		name: newStyleName,
		label: mergedVariation?.label,
	};

	blockTypesToRegister.forEach((blockType) => {
		const oldBlockVariation =
			blockeraMetaData?.blocks?.[blockType]?.variations?.[oldStyleName];
		if (oldBlockVariation && !oldBlockVariation.isDeleted) {
			const base = { ...oldBlockVariation };
			delete base.isDeleted;
			blocksUpdate[blockType] = {
				variations: {
					[newStyleName]:
						blockType === blockName
							? mergedVariation
							: mergeObject(base, identityUpdate),
				},
			};
		}
	});

	const result: Object = {};
	if (Object.keys(blocksUpdate).length > 0) {
		result.blocks = blocksUpdate;
	}
	if (Object.keys(oldGlobalVariation).length > 0) {
		result.variations = {
			[newStyleName]: mergeObject(
				{ ...oldGlobalVariation },
				identityUpdate
			),
		};
	}
	return result;
};

export const markStyleAsDeletedInMetaData = (
	blockeraMetaData: Object,
	blockName: string,
	styleName: string,
	styleFallback: Object,
	baseConfig: Object
): Object => {
	const updatedMetaData = cloneObject(blockeraMetaData);
	const isBlockeraStyle = isBlockeraCreatedStyle(
		styleFallback || { name: styleName },
		baseConfig || {},
		blockName
	);

	if (
		isBlockeraStyle &&
		updatedMetaData?.blocks?.[blockName]?.variations?.[styleName]
	) {
		delete updatedMetaData.blocks[blockName].variations[styleName];
		const blockVariations = updatedMetaData.blocks[blockName].variations;
		if (Object.keys(blockVariations).length === 0) {
			delete updatedMetaData.blocks[blockName].variations;
			const blockKeys = Object.keys(
				updatedMetaData.blocks[blockName] || {}
			);
			if (blockKeys.length === 0) {
				delete updatedMetaData.blocks[blockName];
			}
		}
		if (updatedMetaData.variations?.[styleName]) {
			delete updatedMetaData.variations[styleName];
		}
	} else if (updatedMetaData?.blocks?.[blockName]?.variations?.[styleName]) {
		updatedMetaData.blocks[blockName].variations[styleName].isDeleted =
			true;
	} else {
		return mergeObject(updatedMetaData, {
			blocks: {
				[blockName]: {
					variations: {
						[styleName]: {
							...styleFallback,
							isDeleted: true,
						},
					},
				},
			},
		});
	}
	return updatedMetaData;
};

/**
 * Detect if a style variation was created by Blockera (user-created) vs from
 * block definition, theme.json, or WP core theme.json.
 *
 * Blockera-created styles have blockera icon. Styles from block/theme/core
 * exist in base theme or have wordpress icon.
 *
 * @param {Object} style - Style object with name, icon, etc.
 * @param {Object} baseConfig - Base theme global styles (from core store).
 * @param {string} blockName - Block type name.
 * @return {boolean} True if Blockera-created (remove from metadata when deleted).
 */
export const isBlockeraCreatedStyle = (
	style: Object,
	baseConfig: Object,
	blockName: string
): boolean => {
	if (!style?.name) {
		return false;
	}

	// Blockera-created styles have blockera icon
	const hasBlockeraIcon =
		style?.icon?.name === 'blockera' && style?.icon?.library === 'blockera';

	// Style from theme.json or block definition exists in base
	const isInBaseTheme =
		baseConfig?.styles?.blocks?.[blockName]?.variations?.[style.name];

	// Blockera-created: has blockera icon AND not in base theme
	if (hasBlockeraIcon && !isInBaseTheme) {
		return true;
	}

	// From block/theme/core: in base or default style
	return false;
};
