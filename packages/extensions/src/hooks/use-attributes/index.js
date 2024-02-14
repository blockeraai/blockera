// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import { isInnerBlock } from '../../components';
import { deleteExtraItems, isChanged } from './helpers';
import actions, { type UseAttributesActions } from './actions';
import type { THandleOnChangeAttributes } from '../../libs/types';

export const useAttributes = (
	setAttributes: (attributes: Object) => void,
	{
		blockId,
		isNormalState,
		getAttributes,
		masterIsNormalState,
		publisherInnerBlocks,
	}: {
		blockId: string,
		isNormalState: () => boolean,
		publisherInnerBlocks: Object,
		masterIsNormalState: () => boolean,
		getAttributes: (key: string) => any,
	}
): {
	handleOnChangeAttributes: THandleOnChangeAttributes,
} => {
	const handleOnChangeAttributes: THandleOnChangeAttributes = (
		attributeId,
		newValue,
		options = {}
	): void => {
		const {
			ref,
			updateItems = {},
			deleteItems = [],
			deleteItemsOnResetAction = [],
		} = options;
		const { getSelectedBlock } = select('core/block-editor');
		let { attributes = {} } = getSelectedBlock() || {};
		const {
			getExtensionCurrentBlock,
			getExtensionInnerBlockState,
			getExtensionCurrentBlockState,
			getExtensionCurrentBlockStateBreakpoint,
		} = select('publisher-core/extensions');
		const currentBlock = getExtensionCurrentBlock();

		// check - is really changed attribute from root?
		if (
			isNormalState() &&
			!isInnerBlock(currentBlock) &&
			!isChanged(attributes, attributeId, newValue)
		) {
			return;
		}

		const currentState = getExtensionCurrentBlockState();
		const currentInnerBlockState = getExtensionInnerBlockState();
		const currentBreakpoint = getExtensionCurrentBlockStateBreakpoint();

		// if handler has any delete items!
		deleteExtraItems(deleteItems, attributes);

		// Assume activated state is normal and existed "updateItems" has items!
		if (
			'object' === typeof updateItems &&
			Object.values(updateItems)?.length &&
			isNormalState()
		) {
			attributes = {
				...attributes,
				...updateItems,
			};
		}

		let innerBlockAttributes = {};

		// inner blocks by default array empty!
		// when value is empty or innerBlockId has "-1" value needs to use root attributes to prevent undefined error!
		if (!publisherInnerBlocks.length || !isInnerBlock(currentBlock)) {
			innerBlockAttributes = attributes;
		} else {
			innerBlockAttributes = !isInnerBlock(currentBlock)
				? {}
				: publisherInnerBlocks[currentBlock]?.attributes || {};
		}

		let currentBlockAttributes = attributes;

		// when current block is one of inner block types, must be use of inner block attributes!
		if (isInnerBlock(currentBlock)) {
			currentBlockAttributes = innerBlockAttributes;
		}

		const attributeIsRelatedStatesAttributes =
			'publisherBlockStates' === attributeId;

		const {
			updateNormalState,
			updateBlockStates,
			updateInnerBlockStates,
			updateInnerBlockInsideParentState,
		}: UseAttributesActions = actions({
			ref,
			blockId,
			newValue,
			attributeId,
			updateItems,
			currentState,
			currentBlock,
			getAttributes,
			isNormalState,
			currentBreakpoint,
			publisherInnerBlocks,
			currentBlockAttributes,
			currentInnerBlockState,
			deleteItemsOnResetAction,
			attributeIsRelatedStatesAttributes,
		});

		// Assume attribute id is string, and activated state is normal, or attribute ["publisherCurrentState" or "publisherBlockStates"] will change!
		if (
			masterIsNormalState() &&
			isNormalState() &&
			attributeIsRelatedStatesAttributes
		) {
			return setAttributes(reducer(attributes, updateNormalState()));
		}

		if (isInnerBlock(currentBlock) && !masterIsNormalState()) {
			return setAttributes(
				reducer(attributes, updateInnerBlockInsideParentState())
			);
		}

		// handle update attributes in activated state and breakpoint!
		if (
			isInnerBlock(currentBlock) &&
			!isNormalState() &&
			!attributeIsRelatedStatesAttributes
		) {
			return setAttributes(reducer(attributes, updateInnerBlockStates()));
		} else if (isInnerBlock(currentBlock)) {
			return setAttributes(reducer(attributes, updateNormalState()));
		}

		// Assume block state is normal and attributeId is equals with "publisherBlockStates".
		if (attributeIsRelatedStatesAttributes || isNormalState()) {
			return setAttributes(reducer(attributes, updateNormalState()));
		}

		// handle update attributes in activated state and breakpoint!
		setAttributes(reducer(attributes, updateBlockStates()));
	};

	return {
		handleOnChangeAttributes,
	};
};
