// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { getBlockType } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { isEquals, isEmpty, isObject, mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	resetAllStates,
	resetCurrentState,
	memoizedBlockStates,
	prepCustomCssClasses,
	stateResettingValues,
	stateResettingInnerBlockValues,
} from './helpers';
import { isBaseBreakpoint } from '../../editor/header-ui';
import { isInnerBlock } from '../../extensions/components';
import { isNormalStateOnBaseBreakpoint } from '../../extensions/libs/block-card/block-states/helpers';

const reducer = (state: Object = {}, action: Object): Object => {
	const {
		type,
		ref,
		blockId,
		clientId,
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
		stateReadyToReset,
		resetStateAllValues,
		insideBlockInspector,
		activeBlockVariation,
		currentInnerBlockState,
		innerBlockReadyToReset,
		getActiveBlockVariation,
		resetInnerBlockAllValues,
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
			insideBlockInspector,
		},
	];
	const { getState, getInnerState } = select('blockera/editor');

	// resetting block state all values.
	state = stateResettingValues(state, {
		blockId,
		clientId,
		innerBlocks,
		currentBlock,
		currentState,
		isNormalState,
		getAttributes,
		blockVariations,
		currentBreakpoint,
		stateReadyToReset,
		resetStateAllValues,
		defaultAttributes,
		insideBlockInspector,
		activeBlockVariation,
		currentInnerBlockState,
		getActiveBlockVariation,
	});

	// resetting inner block all values.
	if (resetInnerBlockAllValues) {
		state = stateResettingInnerBlockValues(state, {
			currentBlock,
			innerBlockReadyToReset,
		});

		return applyFilters(
			'blockera.blockEdit.setAttributes',
			mergeObject(state),
			...hookParams
		);
	}

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

				const attributesReadyToFilter = mergeObject(
					state,
					{
						blockeraInnerBlocks: {
							value: {
								[currentBlock]: {
									attributes: {
										...effectiveItems,
										...(mergedCssClasses
											? {
													className: mergedCssClasses,
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
				);

				// Run filtering when current block is global style for block type,
				// and it is contains `blocks` property from theme or core settings.
				// We should run all `to wp compatibilities` for each blocks provided by external sources.
				if (
					attributesReadyToFilter.hasOwnProperty('blocks') &&
					Object.keys(attributesReadyToFilter.blocks).length &&
					attributesReadyToFilter.blocks.hasOwnProperty(currentBlock)
				) {
					const blockTypeObj = getBlockType(currentBlock);
					const _hookParams = hookParams;

					_hookParams[4].isMasterBlock = true;
					_hookParams[4].blockId = currentBlock;
					_hookParams[4].defaultAttributes = blockTypeObj.attributes;

					attributesReadyToFilter.blocks[currentBlock] = applyFilters(
						'blockera.blockEdit.setAttributes',
						attributesReadyToFilter.blocks[currentBlock],
						..._hookParams
					);
				}

				return applyFilters(
					'blockera.blockEdit.setAttributes',
					attributesReadyToFilter,
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
					// if attributeId starts with 'blockera', set value to { value: newValue } schema
					[attributeId]: attributeId.startsWith('blockera')
						? {
								value: newValue,
							}
						: newValue,
				},
				...hookParams
			);

		case 'UPDATE_BLOCK_STATES':
		case 'UPDATE_INNER_BLOCK_INSIDE_PARENT_STATE':
			const blockeraBlockStates = memoizedBlockStates(state, action, {
				ref,
				currentState,
				insideInnerBlock:
					'UPDATE_INNER_BLOCK_INSIDE_PARENT_STATE' === type,
				currentBlock,
				getState,
				clientId,
				name: blockId,
				hookParams,
				getInnerState,
			});
			const {
				settings: { hasContent },
			} = getState(currentState) ||
				getInnerState(currentState) || {
					settings: { hasContent: false },
				};

			if (
				hasContent &&
				!blockeraBlockStates.value[currentState].hasOwnProperty(
					'content'
				)
			) {
				blockeraBlockStates.value[currentState].content =
					blockeraBlockStates.value[currentState].content || '';
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
				mergeObject(
					state,
					{
						blockeraBlockStates,
					},
					{
						deletedProps: [attributeId],
						forceUpdated:
							isObject(newValue) ||
							(!isObject(newValue) && isEmpty(newValue))
								? [attributeId]
								: [],
					}
				),
				...hookParams
			);

		case 'UPDATE_INNER_BLOCK_STATES':
			const _blockeraBlockStates = memoizedBlockStates(
				(state.blockeraInnerBlocks[currentBlock] || {})?.attributes ||
					{},
				action,
				{
					currentState: currentInnerBlockState,
					insideInnerBlock: false,
					currentBlock,
					clientId,
					name: blockId,
				}
			);

			const {
				settings: { hasContent: _hasContent },
			} = getState(currentInnerBlockState) ||
				getInnerState(currentInnerBlockState) || {
					settings: { hasContent: false },
				};

			if (
				(
					(_hasContent &&
						!((
							(state.blockeraInnerBlocks[currentBlock] || {})
								?.attributes || {}
						)?.blockeraBlockStates || {})[
							currentInnerBlockState
						]) ||
					{}
				)?.hasOwnProperty('content')
			) {
				_blockeraBlockStates[currentInnerBlockState].content =
					_blockeraBlockStates[currentInnerBlockState].content || '';
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
				mergeObject(
					state,
					{
						blockeraInnerBlocks: {
							value: {
								[currentBlock]: {
									attributes: {
										blockeraBlockStates:
											_blockeraBlockStates,
									},
								},
							},
						},
					},
					{
						deletedProps: [attributeId],
						forceUpdated:
							isObject(newValue) ||
							(!isObject(newValue) && isEmpty(newValue))
								? [attributeId]
								: [],
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
