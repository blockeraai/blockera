// @flow

/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Publisher dependencies
 */
import { deletePropertyByPath } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { isBaseBreakpoint, isInnerBlock } from '../../components';
import {
	isChanged,
	getUpdatedBlockStates,
	deleteExtraItems,
	memoizedBlockStates,
} from './helpers';

const reducer = (state: Object = {}, action: Object): Object => {
	const {
		type,
		ref,
		blockId,
		newValue,
		attributeId,
		currentBlock,
		currentState,
		currentBreakpoint,
		isNormalState,
		getAttributes,
		publisherInnerBlocks,
		currentBlockAttributes,
		deleteItemsOnResetAction,
	} = action;

	switch (type) {
		case 'UPDATE_NORMAL_STATE':
			if (ref?.current?.reset) {
				const newAttributes = {
					...state,
				};

				deletePropertyByPath(
					newAttributes,
					ref.current.path.replace(/\[/g, '.').replace(/]/g, '')
				);

				// if handler has deleteItemsOnResetAction.
				deleteExtraItems(deleteItemsOnResetAction, state);
			}

			if (!isChanged(currentBlockAttributes, attributeId, newValue)) {
				return;
			}

			// Handle inner block changes.
			if (isInnerBlock(currentBlock)) {
				const newPublisherInnerBlocks = state.publisherInnerBlocks;

				if (!newPublisherInnerBlocks[currentBlock]) {
					newPublisherInnerBlocks[currentBlock] = {
						attributes: {},
					};
				}

				newPublisherInnerBlocks[currentBlock].attributes[attributeId] =
					newValue;

				state.publisherInnerBlocks = newPublisherInnerBlocks;

				return state;
			}

			/**
			 * Filterable attributes before set next state.
			 * usefully in add WordPress compatibility and any other filters.
			 *
			 * hook: 'publisher-core/block/extensions/set-attributes'
			 *
			 * @since 1.0.0
			 */
			return applyFilters(
				'publisherCore.blockEdit.setAttributes',
				{
					...state,
					[attributeId]: newValue,
				},
				attributeId,
				newValue,
				ref,
				getAttributes,
				{
					blockId,
					isNormalState: isNormalState(),
					isMasterBlock: isInnerBlock(currentBlock),
					isBaseBreakpoint: isBaseBreakpoint(currentBreakpoint),
					currentBlock,
					currentState,
					currentBreakpoint,
				}
			);

		case 'UPDATE_INNER_BLOCK_INSIDE_PARENT_STATE':
			const states = getUpdatedBlockStates(
				{
					states: state.publisherBlockStates,
				},
				action,
				state
			);

			state.publisherBlockStates = states;

			return state;

		case 'UPDATE_INNER_BLOCK_STATES':
			if (!publisherInnerBlocks[currentBlock]) {
				return state;
			}

			const newPublisherInnerBlocks = state.publisherInnerBlocks;

			if (!newPublisherInnerBlocks[currentBlock]) {
				newPublisherInnerBlocks[currentBlock] = {
					attributes: {},
				};
			}

			newPublisherInnerBlocks[
				currentBlock
			].attributes.publisherBlockStates = getUpdatedBlockStates(
				{
					states: state.publisherInnerBlocks[currentBlock].attributes
						.publisherBlockStates,
					inInnerBlock: true,
				},
				action,
				state
			);

			state.publisherInnerBlocks = newPublisherInnerBlocks;

			return state;

		case 'UPDATE_BLOCK_STATES':
			return {
				...state,
				publisherBlockStates: memoizedBlockStates(state, action),
			};
	}

	return state;
};

export default reducer;
