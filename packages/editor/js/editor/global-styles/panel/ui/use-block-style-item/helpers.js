// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import { mergeObject, cloneObject } from '@blockera/utils';

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
 *
 * @param {string} blockName - Block type name.
 * @param {string} styleName - Style variation name.
 * @param {Object} variationData - Data to merge for the variation.
 * @return {Object} - The blockera meta data update object.
 */
export const buildVariationMetaDataUpdate = (
	blockName: string,
	styleName: string,
	variationData: Object
): Object => ({
	blocks: {
		[blockName]: {
			variations: {
				[styleName]: variationData,
			},
		},
	},
});

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
 * Build blockera meta data for duplicate style (blocks + variations).
 *
 * @param {Object} existingMetaData - Existing blockera meta data.
 * @param {string} blockName - Block type name.
 * @param {Object} duplicateStyle - New style object.
 * @param {Array<string>} blockTypesToRegister - Block types for the style.
 * @return {Object} - The blockera meta data update object.
 */
export const buildDuplicateStyleMetaData = (
	existingMetaData: Object,
	blockName: string,
	duplicateStyle: Object,
	blockTypesToRegister: Array<string>
): Object =>
	mergeObject(existingMetaData, {
		blocks: {
			[blockName]: {
				variations: {
					[duplicateStyle.name]: duplicateStyle,
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
