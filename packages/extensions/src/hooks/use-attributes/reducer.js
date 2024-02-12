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
import { isInnerBlock } from '../../components';
import {
	isChanged,
	getBlockStates,
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
		isNormalState,
		getAttributes,
		publisherInnerBlocks,
		addOrModifyRootItems,
		currentBlockAttributes,
		deleteItemsOnResetAction,
		attributeIsRelatedStatesAttributes,
	} = action;
	console.log(type);
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
				return {
					...state,
					publisherInnerBlocks: {
						...state.publisherInnerBlocks,
						[currentBlock]: {
							...(state.publisherInnerBlocks[currentBlock] ?? {}),
							attributes: {
								...(state.publisherInnerBlocks[currentBlock]
									?.attributes || {}),
								...(attributeIsRelatedStatesAttributes
									? addOrModifyRootItems
									: {}),
								[attributeId]: newValue,
							},
						},
					},
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
			if (!publisherInnerBlocks[currentBlock]) {
				return state;
			}

			publisherInnerBlocks[currentBlock].attributes.publisherBlockStates =
				getBlockStates(
					{
						blockStates:
							publisherInnerBlocks[currentBlock].attributes
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
