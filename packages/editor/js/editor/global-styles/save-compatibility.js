// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { dispatch, select } from '@wordpress/data';
import { getBlockType } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { isEquals, mergeObject } from '@blockera/utils';
import { mergeBaseAndUserConfigs } from '@blockera/global-styles-ui';

/**
 * Internal dependencies
 */
import { getBlockAttributes } from './panel/context';
import { sanitizeGlobalStylesNode } from './panel/ui/use-block-style-item/helpers';
import { getBaseBreakpoint } from '../header-ui/components/breakpoints/helpers';
import { blockeraExtensionsBootstrap } from '../../extensions/libs/bootstrap';
import { prepareBlockeraDefaultAttributesValues } from '../../extensions/components/utils';
import { getCompatibleAttributes } from '../../extensions/components/get-compatible-attributes';

const SAVE_BUTTON_SELECTOR = [
	'.editor-post-publish-button__button',
	'.editor-post-save-draft',
	'.editor-post-switch-to-draft',
	'.editor-entities-saved-states__save-button',
	'.edit-site-save-button__button',
	'.edit-site-save-hub__button',
].join(',');

let isRegistered = false;
let isCompatibilityBootstrapped = false;

const ensureCompatibilityFilters = (): void => {
	if (isCompatibilityBootstrapped) {
		return;
	}

	blockeraExtensionsBootstrap();
	isCompatibilityBootstrapped = true;
};

const getGlobalStylesRecord = (): {
	id: string | number,
	record: Object,
} | null => {
	const coreStore = select('core');
	const id = coreStore.__experimentalGetCurrentGlobalStylesId?.();

	if (!id) {
		return null;
	}

	const record =
		coreStore.getEditedEntityRecord?.('root', 'globalStyles', id) ||
		coreStore.getEntityRecord?.('root', 'globalStyles', id);

	if (!record || 'object' !== typeof record) {
		return null;
	}

	return {
		id,
		record,
	};
};

const hasObjectKeys = (value: any): boolean =>
	!!value && 'object' === typeof value && Object.keys(value).length > 0;

const getGlobalStylesBlocksForCompatibility = (
	record: Object
): Object | null => {
	const styles = record?.styles;

	if (!styles || 'object' !== typeof styles) {
		return null;
	}

	const baseConfig =
		select('core').__experimentalGetCurrentThemeBaseGlobalStyles?.();

	if (!baseConfig || 'object' !== typeof baseConfig) {
		return {};
	}

	return mergeBaseAndUserConfigs(baseConfig, {
		...record,
		styles,
	})?.styles?.blocks;
};

const getCompatibilityBlockContext = (
	blockType: Object
): {
	args: Object,
	defaultAttributes: Object,
	availableAttributes: Object,
} => {
	const { blockExtension, blockeraOverrideBlockAttributes } =
		getBlockAttributes(blockType.name);
	const currentBreakpoint = getBaseBreakpoint();
	const defaultAttributes = mergeObject(
		blockeraOverrideBlockAttributes,
		blockType.attributes
	);

	return {
		args: {
			blockId: blockType.name,
			clientId: blockType.name.replace('/', '-'),
			innerBlocks: blockExtension?.blockeraInnerBlocks || {},
			currentBlock: 'master',
			blockVariations: blockType.variations,
			defaultAttributes: blockType.attributes,
			currentState: 'normal',
			currentBreakpoint,
			activeBlockVariation: null,
			getActiveBlockVariation: () => null,
			currentInnerBlockState: 'normal',
			isNormalState: true,
			isMasterBlock: true,
			isBaseBreakpoint: true,
			isMasterNormalState: true,
			insideBlockInspector: false,
			editorSelectedBlockEvent: 'save-global-styles',
			blockAttributes: prepareBlockeraDefaultAttributesValues(
				defaultAttributes,
				{
					context: 'global-styles-panel',
				}
			),
		},
		defaultAttributes,
		availableAttributes: blockType.attributes,
	};
};

const applyCompatibilityToStyleNode = (
	styleNode: Object,
	blockType: Object
): Object => {
	if (!styleNode || 'object' !== typeof styleNode) {
		return styleNode;
	}

	const { args, availableAttributes, defaultAttributes } =
		getCompatibilityBlockContext(blockType);

	const compatibleAttributes = sanitizeGlobalStylesNode(
		getCompatibleAttributes({
			args,
			isActive: true,
			attributes: { ...styleNode },
			defaultAttributes,
			availableAttributes,
		})
	);

	return cleanupDefaultAttributes(compatibleAttributes, defaultAttributes);
};

const cleanupDefaultAttributes = (
	attributes: Object,
	defaultAttributes: Object
): Object => {
	const defaultValues = prepareBlockeraDefaultAttributesValues(
		defaultAttributes,
		{
			context: 'block-inspector',
		}
	);
	const cleanedAttributes: { [string]: any } = {};

	for (const [attribute, value] of Object.entries(attributes || {})) {
		if (isEquals(value, defaultValues[attribute])) {
			continue;
		}

		cleanedAttributes[attribute] = value;
	}

	return cleanedAttributes;
};

const applyCompatibilityToBlockStyles = (
	blockStyles: Object,
	blockType: Object
): Object => {
	const { variations, ...rootStyles } = blockStyles || {};
	const compatibleRootStyles = applyCompatibilityToStyleNode(
		rootStyles,
		blockType
	);
	const sourceVariations =
		variations && 'object' === typeof variations ? variations : {};
	const compatibleVariations: { [string]: Object } = {};

	for (const [variationName, variationStyles] of Object.entries(
		sourceVariations
	)) {
		const compatibleVariationStyles = applyCompatibilityToStyleNode(
			variationStyles,
			blockType
		);

		if (hasObjectKeys(compatibleVariationStyles)) {
			compatibleVariations[variationName] = compatibleVariationStyles;
		}
	}

	const cleanedBlockStyles = {
		...compatibleRootStyles,
		...(Object.keys(compatibleVariations).length
			? { variations: compatibleVariations }
			: {}),
	};

	return cleanedBlockStyles;
};

export const getGlobalStylesBlocksWithWordPressCompatibility = (
	blocks: Object
): Object => {
	if (!blocks || 'object' !== typeof blocks) {
		return {};
	}

	const compatibleBlocks: { [string]: any } = {};

	for (const [blockName, blockStyles] of Object.entries(blocks)) {
		const blockType = getBlockType(blockName);

		if (!blockType) {
			compatibleBlocks[blockName] = blockStyles;
			continue;
		}

		compatibleBlocks[blockName] = applyCompatibilityToBlockStyles(
			blockStyles,
			blockType
		);

		if (!hasObjectKeys(compatibleBlocks[blockName])) {
			delete compatibleBlocks[blockName];
		}
	}

	return compatibleBlocks;
};

export const runGlobalStylesWordPressCompatibilityBeforeSave = (): boolean => {
	const globalStylesRecord = getGlobalStylesRecord();

	if (!globalStylesRecord) {
		return false;
	}

	const { id, record } = globalStylesRecord;
	const blocks = getGlobalStylesBlocksForCompatibility(record);

	if (!blocks || 'object' !== typeof blocks) {
		return false;
	}

	ensureCompatibilityFilters();

	const compatibleBlocks =
		getGlobalStylesBlocksWithWordPressCompatibility(blocks);

	if (!hasObjectKeys(compatibleBlocks)) {
		return false;
	}

	const compatibleStyles = {
		blocks: compatibleBlocks,
	};

	if (isEquals(record?.styles, compatibleStyles)) {
		return false;
	}

	dispatch('core').editEntityRecord('root', 'globalStyles', id, {
		styles: mergeObject(record?.styles || {}, compatibleStyles),
	});

	return true;
};

export const saveGlobalStylesWordPressCompatibilityBeforePostSave =
	async (): Promise<boolean> => {
		if (!runGlobalStylesWordPressCompatibilityBeforeSave()) {
			return false;
		}

		const globalStylesRecord = getGlobalStylesRecord();

		if (!globalStylesRecord) {
			return false;
		}

		await dispatch('core').saveEditedEntityRecord(
			'root',
			'globalStyles',
			globalStylesRecord.id
		);

		return true;
	};

const handleSaveButtonClick = (event: MouseEvent): void => {
	const target = event.target;

	if (!(target instanceof Element) || !target.closest(SAVE_BUTTON_SELECTOR)) {
		return;
	}

	runGlobalStylesWordPressCompatibilityBeforeSave();
};

export const registerGlobalStylesSaveCompatibility = (): void => {
	if (isRegistered) {
		return;
	}

	addFilter(
		'editor.preSavePost',
		'blockera/global-styles/save-compatibility',
		async (edits, options = {}) => {
			if (!options?.isAutosave) {
				await saveGlobalStylesWordPressCompatibilityBeforePostSave();
			}

			return edits;
		}
	);

	if ('undefined' !== typeof document) {
		document.addEventListener('click', handleSaveButtonClick, true);
	}

	isRegistered = true;
};
