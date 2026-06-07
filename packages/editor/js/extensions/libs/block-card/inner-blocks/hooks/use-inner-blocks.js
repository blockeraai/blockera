// @flow

/**
 * External dependencies
 */
import { useCallback } from '@wordpress/element';
import { useSelect, dispatch } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { getSortedObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { InnerBlocks, InnerBlockType } from '../types';
import { generateExtensionId } from '../../../utils';
import { isInnerBlock } from '../../../../components';
import { useMemoizedInnerBlocks, useAvailableItems } from './';
import { useGlobalStylesPanelContext } from '../../../../../editor/global-styles/panel/context';

export const useInnerBlocks = ({
	block,
	values,
	maxItems,
	onChange,
	innerBlocks,
	currentBlock,
	insideBlockInspector = true,
}: {
	block: Object,
	values: Object,
	onChange: Function,
	maxItems?: number | void,
	innerBlocks: InnerBlocks,
	insideBlockInspector?: boolean,
	currentBlock: 'master' | InnerBlockType | string,
}): Object => {
	const { extensionsUiContext: panelExtensionsUiContext } =
		useGlobalStylesPanelContext();
	const extensionsUiContext = insideBlockInspector
		? undefined
		: panelExtensionsUiContext;

	// Internal selectors. to access current selected block and inner blocks stack of Blockera editor/extensions store api.
	const {
		currentBlock: currentBlockType = currentBlock,
		getBlockInners,
		getBlockExtensionBy,
	} = useSelect(
		(select) => {
			const {
				getBlockInners,
				getBlockExtensionBy,
				getExtensionCurrentBlock,
			} = select('blockera/extensions');

			return {
				getBlockInners,
				getBlockExtensionBy,
				currentBlock: getExtensionCurrentBlock(extensionsUiContext),
			};
		},
		[extensionsUiContext]
	);

	// Internal dispatchers. to use of "setCurrentBlock" and "setBlockClientInners" dispatchers of Blockera editor/extensions store api.
	const {
		changeExtensionCurrentBlock: changeExtensionCurrentBlockDispatch,
		setBlockClientInners,
	} = dispatch('blockera/extensions') || {};

	const setCurrentBlock = useCallback(
		(block: 'master' | InnerBlockType | string) => {
			changeExtensionCurrentBlockDispatch(block, extensionsUiContext);
		},
		[changeExtensionCurrentBlockDispatch, extensionsUiContext]
	);

	// Calculation: to prepare standard values for "blockeraInnerBlocks" block attribute with set initial value for repeater by "setBlockClientInners" dispatcher.
	const memoizedInnerBlocks = useMemoizedInnerBlocks({
		getBlockInners,
		getBlockExtensionBy,
		insideBlockInspector,
		setBlockClientInners,
		controlValue: values,
		clientId: block?.clientId,
		blockName: block?.blockName,
		reservedInnerBlocks: innerBlocks,
		selectedBlockClientId: block?.selectedBlockClientId,
	});

	// Calculation: to categorized in two category (elements and blocks) from available inner blocks on current WordPress selected block.
	const { elements, blocks } = useAvailableItems({
		maxItems,
		getBlockInners,
		memoizedInnerBlocks,
		insideBlockInspector,
		setBlockClientInners,
		clientId: block?.clientId,
		reservedInnerBlocks: Object.keys(innerBlocks).length
			? innerBlocks
			: memoizedInnerBlocks,
	});

	// Merging all categories, as available blocks.
	const availableBlocks = [...elements, ...blocks];

	// Get repeater value from internal Blockera store api.
	const value = getSortedObject(
		getBlockInners(block.clientId),
		'settings',
		10
	);

	for (const item in value) {
		value[item] = {
			...value[item],
			isSelected: currentBlockType === item,
			selectable: true,
		};
	}

	const onReset = useCallback(
		(itemId, items) => {
			onChange('blockeraInnerBlocks', items, {
				ref: {
					current: {
						path: isInnerBlock(currentBlock)
							? 'blockeraInnerBlocks.value'
							: currentBlock,
						action: 'normal',
						reset: false,
					},
				},
				resetInnerBlockAllValues: true,
				innerBlockReadyToReset: itemId,
			});

			return items;
		},
		// eslint-disable-next-line
		[currentBlock]
	);

	// cache length to not calculate it multiple times
	const innerBlocksLength = Object.keys(innerBlocks).length;

	// We should skip return contextValue when running just inside block inspector and has not any inner blocks.
	// in global styles panel we need to static inner blocks to design them for all placements.
	// Blocks like core/navigation may have zero extension config but still expose allowed inner blocks via the editor.
	const hasInnerBlockSupport =
		innerBlocksLength > 0 ||
		availableBlocks.length > 0 ||
		Object.keys(value).length > 0;
	const skipInnerBlocksContext =
		insideBlockInspector &&
		(!hasInnerBlockSupport || isInnerBlock(currentBlock));

	if (skipInnerBlocksContext) {
		return {};
	}

	// Assign control context provider value.
	const contextValue = {
		block,
		value,
		blockName: block.blockName,
		attribute: 'blockeraInnerBlocks',
		name: generateExtensionId(block, 'inner-blocks', false),
	};

	return {
		blocks,
		onReset,
		elements,
		contextValue,
		getBlockInners,
		setCurrentBlock,
		availableBlocks,
		innerBlocksLength,
		setBlockClientInners,
		maxItems: innerBlocksLength,
	};
};
