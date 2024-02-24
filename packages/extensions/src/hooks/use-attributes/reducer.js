// @flow

/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { memoizedBlockStates } from './helpers';
import { isBaseBreakpoint, isInnerBlock } from '../../components';

const reducer = (state: Object = {}, action: Object): Object => {
	const {
		type,
		ref,
		blockId,
		newValue,
		attributeId,
		currentBlock,
		currentState,
		isNormalState,
		getAttributes,
		currentBreakpoint,
		currentInnerBlockState,
	} = action;

	const hookParams = [
		attributeId,
		newValue,
		ref,
		getAttributes,
		{
			blockId,
			currentBlock,
			currentState,
			currentBreakpoint,
			currentInnerBlockState,
			isNormalState: isNormalState(),
			isMasterBlock: !isInnerBlock(currentBlock),
			isBaseBreakpoint: isBaseBreakpoint(currentBreakpoint),
		},
	];

	switch (type) {
		case 'UPDATE_NORMAL_STATE':
			// Handle inner block changes.
			if (isInnerBlock(currentBlock)) {
				/**
				 * Filterable attributes before set next state.
				 * usefully in add WordPress compatibility and any other filters.
				 *
				 * hook: 'publisherCore.blockEdit.setAttributes'
				 *
				 * @since 1.0.0
				 */
				return applyFilters(
					'publisherCore.blockEdit.setAttributes',
					{
						...state,
						publisherInnerBlocks: {
							...state.publisherInnerBlocks,
							[currentBlock]: {
								...(state.publisherInnerBlocks[currentBlock] ||
									{}),
								attributes: {
									...(state.publisherInnerBlocks[
										currentBlock
									] &&
									state.publisherInnerBlocks[currentBlock]
										?.attributes
										? state.publisherInnerBlocks[
												currentBlock
										  ]?.attributes
										: {}),
									[attributeId]: newValue,
								},
							},
						},
					},
					...hookParams
				);
			}

			/**
			 * Filterable attributes before set next state.
			 * usefully in add WordPress compatibility and any other filters.
			 *
			 * hook: 'publisherCore.blockEdit.setAttributes'
			 *
			 * @since 1.0.0
			 */
			return applyFilters(
				'publisherCore.blockEdit.setAttributes',
				{ ...state, [attributeId]: newValue },
				...hookParams
			);

		case 'UPDATE_BLOCK_STATES':
		case 'UPDATE_INNER_BLOCK_INSIDE_PARENT_STATE':
			/**
			 * Filterable attributes before set next state.
			 * usefully in add WordPress compatibility and any other filters.
			 *
			 * hook: 'publisherCore.blockEdit.setAttributes'
			 *
			 * @since 1.0.0
			 */
			return applyFilters(
				'publisherCore.blockEdit.setAttributes',
				{
					...state,
					publisherBlockStates: memoizedBlockStates(state, action),
				},
				...hookParams
			);

		case 'UPDATE_INNER_BLOCK_STATES':
			/**
			 * Filterable attributes before set next state.
			 * usefully in add WordPress compatibility and any other filters.
			 *
			 * hook: 'publisherCore.blockEdit.setAttributes'
			 *
			 * @since 1.0.0
			 */
			return applyFilters(
				'publisherCore.blockEdit.setAttributes',
				{
					...state,
					publisherInnerBlocks: {
						...state.publisherInnerBlocks,
						[currentBlock]: {
							...state.publisherInnerBlocks[currentBlock],
							attributes: {
								...state.publisherInnerBlocks[currentBlock]
									.attributes,
								publisherBlockStates: memoizedBlockStates(
									state.publisherInnerBlocks[currentBlock]
										.attributes,
									action,
									true
								),
							},
						},
					},
				},
				...hookParams
			);
	}

	/**
	 * Filterable attributes before set next state.
	 * usefully in add WordPress compatibility and any other filters.
	 *
	 * hook: 'publisherCore.blockEdit.setAttributes'
	 *
	 * @since 1.0.0
	 */
	return applyFilters(
		'publisherCore.blockEdit.setAttributes',
		state,
		...hookParams
	);
};

export default reducer;
