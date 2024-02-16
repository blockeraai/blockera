// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import { isChanged } from './helpers';
import { isInnerBlock } from '../../components';
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
		const { ref } = options;
		const { getSelectedBlock } = select('core/block-editor');
		const { attributes = {} } = getSelectedBlock() || {};
		const {
			getExtensionCurrentBlock,
			getExtensionInnerBlockState,
			getExtensionCurrentBlockState,
			getExtensionCurrentBlockStateBreakpoint,
		} = select('publisher-core/extensions');
		const currentBlock = getExtensionCurrentBlock();

		// attributes => immutable - mean just read-only!
		// _attributes => mutable - mean readable and writable constant!
		const _attributes = { ...attributes };

		const attributeIsPublisherBlockStates =
			'publisherBlockStates' === attributeId;

		// check - is really changed attribute of any block type (master or one of inner blocks)?
		if (isNormalState()) {
			if (
				isInnerBlock(currentBlock) &&
				!isChanged(
					{
						..._attributes,
						..._attributes.publisherInnerBlocks[currentBlock]
							.attributes,
					},
					attributeId,
					newValue
				)
			) {
				return;
			}

			if (!isChanged(attributes, attributeId, newValue)) {
				return;
			}
		}

		const currentState = getExtensionCurrentBlockState();
		const currentInnerBlockState = getExtensionInnerBlockState();
		const currentBreakpoint = getExtensionCurrentBlockStateBreakpoint();

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
			currentState,
			currentBlock,
			getAttributes,
			isNormalState,
			currentBreakpoint,
			publisherInnerBlocks,
			currentInnerBlockState,
			attributeIsPublisherBlockStates,
		});

		// Current block (maybe 'master' or any inner blocks) in normal state!
		// or
		// attribute is "publisherBlockStates"
		// action = UPDATE_NORMAL_STATE
		if (masterIsNormalState() && isNormalState()) {
			return setAttributes(reducer(_attributes, updateNormalState()));
		}

		// Assume current block is one of inner blocks.
		if (isInnerBlock(currentBlock)) {
			// Assume master block isn't in normal state!
			// action = UPDATE_INNER_BLOCK_INSIDE_PARENT_STATE
			if (!masterIsNormalState()) {
				const currentBlockAttributes =
					_attributes.publisherBlockStates[currentState].breakpoints[
						currentBreakpoint
					].attributes;

				if (
					currentBlockAttributes?.publisherInnerBlocks &&
					currentBlockAttributes?.publisherInnerBlocks[
						currentBlock
					] &&
					currentBlockAttributes?.publisherInnerBlocks[currentBlock]
						?.attributes &&
					!isChanged(
						{
							..._attributes,
							..._attributes.publisherBlockStates[currentState]
								.breakpoints[currentBreakpoint].attributes,
							...currentBlockAttributes?.publisherInnerBlocks[
								currentBlock
							]?.attributes,
						},
						attributeId,
						newValue
					)
				) {
					return;
				}

				return setAttributes(
					reducer(attributes, updateInnerBlockInsideParentState())
				);
			}
			// Assume current block isn't in normal state and attributeId isn't "publisherBlockStates" for prevent cyclic object error!
			// action = UPDATE_INNER_BLOCK_STATES
			if (!isNormalState() && !attributeIsPublisherBlockStates) {
				if (
					!isChanged(
						{
							..._attributes,
							..._attributes.publisherInnerBlocks[currentBlock]
								.attributes,
							..._attributes.publisherInnerBlocks[currentBlock]
								.attributes.publisherBlockStates[
								currentInnerBlockState
							].breakpoints[currentBreakpoint].attributes,
						},
						attributeId,
						newValue
					)
				) {
					return;
				}

				return setAttributes(
					reducer(_attributes, updateInnerBlockStates())
				);
			}
		}

		// Assume block state is normal and attributeId is equals with "publisherBlockStates".
		// action = UPDATE_NORMAL_STATE
		if (attributeIsPublisherBlockStates || isNormalState()) {
			return setAttributes(reducer(_attributes, updateNormalState()));
		}

		if (
			!isChanged(
				{
					..._attributes,
					..._attributes.publisherBlockStates[currentState]
						.breakpoints[currentBreakpoint].attributes,
				},
				attributeId,
				newValue,
				{
					[attributeId]: null,
				}
			)
		) {
			return;
		}

		// handle update attributes in activated state and breakpoint for master block.
		// action = UPDATE_BLOCK_STATES
		setAttributes(reducer(_attributes, updateBlockStates()));
	};

	return {
		handleOnChangeAttributes,
	};
};
