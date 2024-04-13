// @flow

/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Publisher dependencies
 */
import { mergeObject } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { memoizedBlockStates, resetAllStates } from './helpers';
import { isBaseBreakpoint, isInnerBlock } from '../../components';
import { sharedBlockExtensionAttributes as defaultAttributes } from '../../libs';

const reducer = (state: Object = {}, action: Object): Object => {
	const {
		type,
		ref,
		blockId,
		newValue,
		attributeId,
		innerBlocks,
		currentBlock,
		currentState,
		isNormalState,
		getAttributes,
		effectiveItems,
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
			innerBlocks,
			currentBlock,
			currentState: isInnerBlock(currentBlock)
				? currentInnerBlockState
				: currentState,
			currentBreakpoint,
			currentInnerBlockState,
			isNormalState: isNormalState(),
			isMasterBlock: !isInnerBlock(currentBlock),
			isBaseBreakpoint: isBaseBreakpoint(currentBreakpoint),
		},
	];
	// console.log(type, attributeId, newValue)
	switch (type) {
		case 'UPDATE_NORMAL_STATE':
			// Handle inner block changes.
			if (isInnerBlock(currentBlock)) {
				if (defaultAttributes[attributeId]?.default === newValue) {
					delete state.publisherInnerBlocks[currentBlock].attributes[
						attributeId
					];
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
					mergeObject(state, {
						publisherInnerBlocks: {
							[currentBlock]: {
								attributes: {
									...effectiveItems,
									...(defaultAttributes[attributeId]
										?.default === newValue
										? {}
										: { [attributeId]: newValue }),
								},
							},
						},
					}),
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
				{ ...state, ...effectiveItems, [attributeId]: newValue },
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
					publisherBlockStates: memoizedBlockStates(state, action, {
						currentState,
						insideInnerBlock:
							'UPDATE_INNER_BLOCK_INSIDE_PARENT_STATE' === type,
					}),
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
				mergeObject(state, {
					publisherInnerBlocks: {
						[currentBlock]: {
							attributes: {
								publisherBlockStates: memoizedBlockStates(
									state.publisherInnerBlocks[currentBlock]
										.attributes,
									action,
									{
										currentState: currentInnerBlockState,
										insideInnerBlock: false,
									}
								),
							},
						},
					},
				}),
				...hookParams
			);

		case 'RESET_ALL':
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
				resetAllStates(state, action),
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
