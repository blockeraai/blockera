// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';

/**
 * Blockera dependencies
 */
import { update } from '@blockera/data-extractor';
import { isEquals, isObject, mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { sharedBlockExtensionAttributes as defaultAttributes } from '../../libs';
import { isInnerBlock, isNormalState } from '../../components';
import type {
	StateTypes,
	BreakpointTypes,
} from '../../libs/block-states/types';

// Check required to update.
export const isChanged = (
	stateAttributes: Object,
	key: string,
	newValue: any,
	fallbackAttributes: Object
): boolean => {
	if (!stateAttributes || !stateAttributes[key]) {
		if (
			'undefined' === typeof fallbackAttributes ||
			!fallbackAttributes[key]
		) {
			return true;
		}

		return !isEquals(fallbackAttributes[key], newValue);
	}

	return !isEquals(stateAttributes[key], newValue);
};

export const memoizedRootBreakpoints: (
	breakpoint: BreakpointTypes,
	action: Object,
	insideInnerBlock: boolean
) => BreakpointTypes = memoize(
	(
		breakpoint,
		{
			newValue,
			attributeId,
			currentBlock,
			effectiveItems,
			currentBreakpoint,
			currentInnerBlockState,
		},
		insideInnerBlock: boolean = false
	) => {
		if (isInnerBlock(currentBlock) && insideInnerBlock) {
			if (!isNormalState(currentInnerBlockState)) {
				if ('blockeraBlockStates' === attributeId) {
					return mergeObject(
						breakpoint,
						{
							attributes: {
								blockeraInnerBlocks: {
									[currentBlock]: {
										attributes: {
											...effectiveItems,
											[attributeId]: newValue,
										},
									},
								},
							},
						},
						{
							forceUpdated: [attributeId],
						}
					);
				}

				const isEqualsWithDefault = isEquals(
					defaultAttributes[attributeId]?.default,
					newValue
				);

				return mergeObject(
					breakpoint,
					{
						attributes: {
							blockeraInnerBlocks: {
								[currentBlock]: {
									attributes: {
										blockeraBlockStates: {
											[currentInnerBlockState]: {
												breakpoints: {
													[currentBreakpoint]: {
														attributes: {
															...effectiveItems,
															[attributeId]:
																isEqualsWithDefault
																	? undefined
																	: newValue,
														},
													},
												},
											},
										},
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
			}

			return mergeObject(breakpoint, {
				attributes: {
					blockeraInnerBlocks: {
						[currentBlock]: {
							attributes: {
								...effectiveItems,
								[attributeId]: newValue,
							},
						},
					},
				},
			});
		}

		const isEqualsWithDefault = isEquals(
			defaultAttributes[attributeId]?.default,
			newValue
		);

		return mergeObject(
			breakpoint,
			{
				attributes: {
					...effectiveItems,
					[attributeId]: isEqualsWithDefault ? undefined : newValue,
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
	}
);

export const memoizedBlockStates: (
	currentBlockAttributes: Object,
	action: Object,
	args: Object
) => Array<StateTypes> = memoize(
	(
		currentBlockAttributes: Object,
		action: Object,
		args: Object = {
			currentState: 'normal',
			insideInnerBlock: false,
		}
	): Object => {
		const { currentState: recievedState, insideInnerBlock } = args;
		const { currentState, currentBreakpoint } = action;
		const breakpoints =
			currentBlockAttributes?.blockeraBlockStates[
				recievedState || currentState
			]?.breakpoints;

		return mergeObject(
			currentBlockAttributes?.blockeraBlockStates,
			{
				[recievedState || currentState]: {
					breakpoints: {
						[currentBreakpoint]: memoizedRootBreakpoints(
							breakpoints[currentBreakpoint],
							action,
							insideInnerBlock
						),
					},
				},
			},
			{
				forceUpdated: isObject(action.newValue)
					? [action.attributeId]
					: [],
			}
		);
	}
);

export const resetAllStates = (state: Object, action: Object): Object => {
	const { attributeId, newValue, currentBlock } = action;

	if (isInnerBlock(currentBlock)) {
		const newState = update(
			state,
			`blockeraInnerBlocks.${currentBlock}.attributes.${attributeId}`,
			newValue,
			true
		);

		return mergeObject(newState, {
			blockeraInnerBlocks: mergeObject(newState.blockeraInnerBlocks, {
				[currentBlock]: {
					attributes: {
						blockeraBlockStates: Object.fromEntries(
							Object.entries(
								newState.blockeraInnerBlocks[currentBlock]
									.attributes?.blockeraBlockStates || {}
							).map(
								([stateType, _state]: [string, Object]): [
									string,
									Object
								] => {
									return [
										stateType,
										mergeObject(_state, {
											breakpoints: Object.fromEntries(
												Object.entries(
													_state.breakpoints
												).map(
													([
														breakpointType,
														breakpoint,
													]: [string, Object]): [
														string,
														Object
													] => {
														return [
															breakpointType,
															update(
																breakpoint,
																`attributes.${attributeId}`,
																newValue,
																true
															),
														];
													}
												)
											),
										}),
									];
								}
							)
						),
					},
				},
			}),
		});
	}

	return mergeObject(update(state, attributeId, newValue, true), {
		[attributeId]: newValue,
		blockeraBlockStates: Object.fromEntries(
			Object.entries(state.blockeraBlockStates).map(
				([stateType, _state]: [string, Object]): [string, Object] => {
					return [
						stateType,
						mergeObject(_state, {
							breakpoints: Object.fromEntries(
								Object.entries(_state.breakpoints).map(
									([breakpointType, breakpoint]: [
										string,
										Object
									]): [string, Object] => {
										return [
											breakpointType,
											update(
												breakpoint,
												`attributes.${attributeId}`,
												newValue,
												true
											),
										];
									}
								)
							),
						}),
					];
				}
			)
		),
	});
};
