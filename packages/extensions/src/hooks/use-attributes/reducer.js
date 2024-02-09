// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';
import { applyFilters } from '@wordpress/hooks';

/**
 * Publisher dependencies
 */
import { deletePropertyByPath } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { isInnerBlock } from '../../components';
import {
	isChanged,
	getBlockStates,
	deleteExtraItems,
	memoizedBlockStates,
} from './helpers';
import type { InnerBlockModel } from '../../libs/inner-blocks/types';

const reducer = (state: Object = {}, action: Object): Object => {
	const {
		type,
		ref,
		blockId,
		newValue,
		attributeId,
		currentBlock,
		innerBlockId,
		isNormalState,
		getAttributes,
		publisherInnerBlocks,
		addOrModifyRootItems,
		currentBlockAttributes,
		deleteItemsOnResetAction,
		attributeIsRelatedStatesAttributes,
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
				const memoizedNewInnerBlocks = memoize(
					(blocks: Array<InnerBlockModel>) => {
						if (!blocks?.length) {
							return [
								{
									type: currentBlock,
									attributes: {
										[attributeId]: newValue,
										...(attributeIsRelatedStatesAttributes
											? addOrModifyRootItems
											: {}),
									},
								},
							];
						}

						const memoizedBlock = memoize(
							(
								block: InnerBlockModel,
								index: number
							): InnerBlockModel => {
								if (block.type !== currentBlock) {
									return block;
								}

								return {
									...block,
									attributes: {
										...(state.publisherInnerBlocks[index]
											?.attributes || {}),
										...(attributeIsRelatedStatesAttributes
											? addOrModifyRootItems
											: {}),
										[attributeId]: newValue,
									},
								};
							}
						);

						return blocks.map(memoizedBlock);
					}
				);

				return {
					...state,
					publisherInnerBlocks: memoizedNewInnerBlocks(
						state.publisherInnerBlocks
					),
				};
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
				isNormalState,
				blockId
			);
		case 'UPDATE_INNER_BLOCK_INSIDE_PARENT_STATE':
			return {
				...state,
				publisherBlockStates: getBlockStates(
					{
						blockStates: state.publisherBlockStates,
					},
					action,
					state
				),
			};

		case 'UPDATE_INNER_BLOCK_STATES':
			publisherInnerBlocks[innerBlockId].attributes.publisherBlockStates =
				getBlockStates(
					{
						blockStates:
							publisherInnerBlocks[innerBlockId].attributes
								.publisherBlockStates,
					},
					action,
					state
				);

			return {
				...state,
				publisherInnerBlocks,
			};

		case 'UPDATE_BLOCK_STATES':
			return {
				...state,
				publisherBlockStates: memoizedBlockStates(state, action),
			};
	}

	return state;
};

export default reducer;
