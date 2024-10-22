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
import {
	resetAllStates,
	memoizedBlockStates,
	prepCustomCssClasses,
	resetCurrentState,
} from './helpers';
import { isBaseBreakpoint } from '../../canvas-editor';
import { isInnerBlock } from '../../extensions/components';
import { isNormalStateOnBaseBreakpoint } from '../../extensions/libs/block-states/helpers';

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
		blockVariations,
		defaultAttributes,
		currentBreakpoint,
		activeBlockVariation,
		currentInnerBlockState,
		getActiveBlockVariation,
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
			blockVariations,
			defaultAttributes,
			currentState: isInnerBlock(currentBlock)
				? currentInnerBlockState
				: currentState,
			currentBreakpoint,
			activeBlockVariation,
			currentInnerBlockState,
			getActiveBlockVariation,
			isNormalState: isNormalState(),
			isMasterBlock: !isInnerBlock(currentBlock),
			isBaseBreakpoint: isBaseBreakpoint(currentBreakpoint),
			isMasterNormalState: isNormalStateOnBaseBreakpoint(
				currentState,
				currentBreakpoint
			),
		},
	];

	switch (type) {
		case 'UPDATE_NORMAL_STATE':
			// By default is undefined.
			let mergedCssClasses;

			// Handle inner block changes.
			if (isInnerBlock(currentBlock)) {
				const isEqualsWithDefault = isEquals(
					defaultAttributes[attributeId]?.default,
					newValue
				);

				if (
					attributeId === 'blockeraBlockStates' &&
					newValue['custom-class']
				) {
					mergedCssClasses = prepCustomCssClasses(
						newValue['custom-class'],
						state.blockeraInnerBlocks[currentBlock].attributes[
							attributeId
						]['custom-class'],
						state.blockeraInnerBlocks[currentBlock].attributes
							.className
					);
				}

				return applyFilters(
					'blockera.blockEdit.setAttributes',
					mergeObject(
						state,
						{
							blockeraInnerBlocks: {
								value: {
									[currentBlock]: {
										attributes: {
											...effectiveItems,
											...(mergedCssClasses
												? {
														className:
															mergedCssClasses,
												  }
												: {}),
											[attributeId]: isEqualsWithDefault
												? undefined
												: newValue,
										},
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

			if (
				attributeId === 'blockeraBlockStates' &&
				newValue['custom-class']
			) {
				mergedCssClasses = prepCustomCssClasses(
					newValue['custom-class'],
					state[attributeId].value['custom-class'],
					state.className
				);
			}

			/**
			 * Filterable attributes before set next state.
			 * usefully in add WordPress compatibility and any other filters.
			 *
			 * hook: 'blockera.blockEdit.setAttributes'
			 *
			 * @since 1.0.0
			 */
			return applyFilters(
				'blockera.blockEdit.setAttributes',
				{
					...state,
					...effectiveItems,
					...(mergedCssClasses
						? { className: mergedCssClasses }
						: {}),
					[attributeId]: {
						value: newValue,
					},
				},
				...hookParams
			);

		case 'UPDATE_BLOCK_STATES':
		case 'UPDATE_INNER_BLOCK_INSIDE_PARENT_STATE':
			/**
			 * Filterable attributes before set next state.
			 * usefully in add WordPress compatibility and any other filters.
			 *
			 * hook: 'blockera.blockEdit.setAttributes'
			 *
			 * @since 1.0.0
			 */
			return applyFilters(
				'blockera.blockEdit.setAttributes',
				mergeObject(
					state,
					{
						blockeraBlockStates: memoizedBlockStates(
							state,
							action,
							{
								currentState,
								insideInnerBlock:
									'UPDATE_INNER_BLOCK_INSIDE_PARENT_STATE' ===
									type,
								currentBlock,
							}
						),
					},
					{
						deletedProps: [attributeId],
						forceUpdated: isObject(newValue) ? [attributeId] : [],
					}
				),
				...hookParams
			);

		case 'UPDATE_INNER_BLOCK_STATES':
			/**
			 * Filterable attributes before set next state.
			 * usefully in add WordPress compatibility and any other filters.
			 *
			 * hook: 'blockera.blockEdit.setAttributes'
			 *
			 * @since 1.0.0
			 */
			return applyFilters(
				'blockera.blockEdit.setAttributes',
				mergeObject(
					state,
					{
						blockeraInnerBlocks: {
							value: {
								[currentBlock]: {
									attributes: {
										blockeraBlockStates:
											memoizedBlockStates(
												(
													state.blockeraInnerBlocks[
														currentBlock
													] || {}
												)?.attributes || {},
												action,
												{
													currentState:
														currentInnerBlockState,
													insideInnerBlock: false,
													currentBlock,
												}
											),
									},
								},
							},
						},
					},
					{
						deletedProps: [attributeId],
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
			 * hook: 'blockera.blockEdit.setAttributes'
			 *
			 * @since 1.0.0
			 */
			return applyFilters(
				'blockera.blockEdit.setAttributes',
				resetAllStates(state, action),
				...hookParams
			);

		case 'RESET':
			/**
			 * Filterable attributes before set next state.
			 * usefully in add WordPress compatibility and any other filters.
			 *
			 * hook: 'blockera.blockEdit.setAttributes'
			 *
			 * @since 1.0.0
			 */
			return applyFilters(
				'blockera.blockEdit.setAttributes',
				resetCurrentState(state, action),
				...hookParams
			);
	}

	/**
	 * Filterable attributes before set next state.
	 * usefully in add WordPress compatibility and any other filters.
	 *
	 * hook: 'blockera.blockEdit.setAttributes'
	 *
	 * @since 1.0.0
	 */
	return applyFilters(
		'blockera.blockEdit.setAttributes',
		state,
		...hookParams
	);
};

export default reducer;
