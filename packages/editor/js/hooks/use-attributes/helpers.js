// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';

/**
 * Blockera dependencies
 */
import { update } from '@blockera/data-editor';
import { isEquals, isObject, mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { sharedBlockExtensionAttributes as defaultAttributes } from '../../extensions/libs';
import { isInnerBlock, isNormalState } from '../../extensions/components';
import type {
	StateTypes,
	BreakpointTypes,
} from '../../extensions/libs/block-states/types';

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
		let _effectiveItems = { ...effectiveItems };

		if (newValue['custom-class'] && attributeId === 'blockeraBlockStates') {
			const mergedCssClasses = prepCustomCssClasses(
				newValue['custom-class']
			);
			_effectiveItems = {
				...effectiveItems,
				className: mergedCssClasses,
			};
		}

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
															..._effectiveItems,
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
								..._effectiveItems,
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

export const prepCustomCssClasses = (
	newValue: Object,
	prevValue?: Object,
	classNames: string = ''
): string => {
	let _classNames = classNames || '';
	const newCustomClasses = newValue['css-class'].split(' ');
	const prevCustomClasses = prevValue
		? prevValue['css-class'].split(' ')
		: [];

	const preparedNewCssClasses = newCustomClasses.map((customClass) =>
		[...customClass][0] === '.'
			? [...customClass].splice(1).join('').trim()
			: customClass.trim()
	);

	const preparedPrevCssClasses = prevCustomClasses.map((customClass) =>
		[...customClass][0] === '.'
			? [...customClass].splice(1).join('').trim()
			: customClass.trim()
	);

	if (preparedPrevCssClasses.length) {
		_classNames = classNames
			.split(' ')
			.filter((className) => !preparedPrevCssClasses.includes(className))
			.join(' ');
	}

	if (preparedNewCssClasses.length) {
		_classNames = `${_classNames} ${preparedNewCssClasses.join(' ')}`;
	}

	return _classNames.trim();
};
