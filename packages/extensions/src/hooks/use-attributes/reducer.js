// @flow

/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { isEquals, isObject, mergeObject } from '@blockera/utils';

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

	switch (type) {
		case 'UPDATE_NORMAL_STATE':
			// Handle inner block changes.
			if (isInnerBlock(currentBlock)) {
				const isEqualsWithDefault = isEquals(
					defaultAttributes[attributeId]?.default,
					newValue
				);

				/**
				 * Filterable attributes before set next state.
				 * usefully in add WordPress compatibility and any other filters.
				 *
				 * hook: 'blockeraCore.blockEdit.setAttributes'
				 *
				 * @since 1.0.0
				 */
				return applyFilters(
					'blockeraCore.blockEdit.setAttributes',
					mergeObject(
						state,
						{
							blockeraInnerBlocks: {
								[currentBlock]: {
									attributes: {
										...effectiveItems,
										[attributeId]: isEqualsWithDefault
											? undefined
											: newValue,
									},
								},
							},
						},
						{
							deletedProps: [attributeId],
							forceUpdated:
								!isEqualsWithDefault && isObject(newValue)
									? [attributeId]
									: [],
						}
					),
					...hookParams
				);
			}

			/**
			 * Filterable attributes before set next state.
			 * usefully in add WordPress compatibility and any other filters.
			 *
			 * hook: 'blockeraCore.blockEdit.setAttributes'
			 *
			 * @since 1.0.0
			 */
			return applyFilters(
				'blockeraCore.blockEdit.setAttributes',
				{ ...state, ...effectiveItems, [attributeId]: newValue },
				...hookParams
			);

		case 'UPDATE_BLOCK_STATES':
		case 'UPDATE_INNER_BLOCK_INSIDE_PARENT_STATE':
			/**
			 * Filterable attributes before set next state.
			 * usefully in add WordPress compatibility and any other filters.
			 *
			 * hook: 'blockeraCore.blockEdit.setAttributes'
			 *
			 * @since 1.0.0
			 */
			return applyFilters(
				'blockeraCore.blockEdit.setAttributes',
				{
					...state,
					blockeraBlockStates: memoizedBlockStates(state, action, {
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
			 * hook: 'blockeraCore.blockEdit.setAttributes'
			 *
			 * @since 1.0.0
			 */
			return applyFilters(
				'blockeraCore.blockEdit.setAttributes',
				mergeObject(
					state,
					{
						blockeraInnerBlocks: {
							[currentBlock]: {
								attributes: {
									blockeraBlockStates: memoizedBlockStates(
										state.blockeraInnerBlocks[currentBlock]
											.attributes,
										action,
										{
											currentState:
												currentInnerBlockState,
											insideInnerBlock: false,
										}
									),
								},
							},
						},
					},
					{
						forceUpdated: isObject(newValue) ? [attributeId] : [],
					}
				),
				...hookParams
			);

		case 'RESET_ALL':
			/**
			 * Filterable attributes before set next state.
			 * usefully in add WordPress compatibility and any other filters.
			 *
			 * hook: 'blockeraCore.blockEdit.setAttributes'
			 *
			 * @since 1.0.0
			 */
			return applyFilters(
				'blockeraCore.blockEdit.setAttributes',
				resetAllStates(state, action),
				...hookParams
			);
	}

	/**
	 * Filterable attributes before set next state.
	 * usefully in add WordPress compatibility and any other filters.
	 *
	 * hook: 'blockeraCore.blockEdit.setAttributes'
	 *
	 * @since 1.0.0
	 */
	return applyFilters(
		'blockeraCore.blockEdit.setAttributes',
		state,
		...hookParams
	);
};

export default reducer;
