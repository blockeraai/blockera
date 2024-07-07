// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { update } from '@blockera/data-editor';
import { isEquals, isEmpty, isObject, mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type {
	StateTypes,
	BreakpointTypes,
	TStates,
	TBreakpoint,
} from '../../extensions/libs/block-states/types';
import { getBaseBreakpoint } from '../../canvas-editor';
import { isInnerBlock, isNormalState } from '../../extensions/components';
import {
	blockStatesValueCleanup,
	isNormalStateOnBaseBreakpoint,
} from '../../extensions/libs/block-states/helpers';
import { sharedBlockExtensionAttributes as defaultAttributes } from '../../extensions/libs';

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
			currentBlock: 'master',
		}
	): Object => {
		const {
			currentState: recievedState,
			insideInnerBlock,
			currentBlock,
		} = args;
		const { currentState, currentBreakpoint } = action;
		const { getBlockStates } = select('blockera/extensions');
		const { clientId, name } =
			select('core/block-editor')?.getSelectedBlock();
		const blockStates = blockStatesValueCleanup(
			getBlockStates(
				clientId,
				!insideInnerBlock && isInnerBlock(currentBlock)
					? currentBlock
					: name
			)
		);

		const breakpoints =
			blockStates[recievedState || currentState]?.breakpoints;

		return mergeObject(
			currentBlockAttributes?.blockeraBlockStates || {},
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
	const { attributeId, newValue, currentBlock, ref } = action;
	const blockeraBlockStates: { [key: string]: Object } = {};

	if (isInnerBlock(currentBlock)) {
		const newState = update(
			state,
			`blockeraInnerBlocks.${currentBlock}.attributes.${attributeId}`,
			newValue,
			true
		);

		const blockStates =
			newState.blockeraInnerBlocks[currentBlock].attributes
				?.blockeraBlockStates || {};

		for (const stateType in blockStates) {
			const _state = blockStates[stateType];
			const breakpoints = blockStates[stateType]?.breakpoints;

			for (const breakpointType in breakpoints) {
				blockeraBlockStates[stateType] = mergeObject(
					_state,
					update(
						breakpoints[breakpointType],
						`attributes.${attributeId}`,
						newValue,
						true
					)
				);
			}
		}

		return mergeObject(newState, {
			blockeraInnerBlocks: mergeObject(newState.blockeraInnerBlocks, {
				[currentBlock]: {
					attributes: {
						blockeraBlockStates,
					},
				},
			}),
		});
	}

	const blockStates = state.blockeraBlockStates;

	// $FlowFixMe
	for (const stateType: TStates in blockStates) {
		const breakpoints = blockStates[stateType].breakpoints;
		const stateBreakpoints: { [key: string]: Object } = {};

		// $FlowFixMe
		for (const breakpointType: TBreakpoint in breakpoints) {
			if (isNormalStateOnBaseBreakpoint(stateType, breakpointType)) {
				stateBreakpoints[breakpointType] = breakpoints[breakpointType];

				continue;
			}

			if (ref.path && ref.path !== attributeId) {
				const preparedPathValue = update(
					breakpoints[breakpointType].attributes,
					ref.path,
					ref.defaultValue
				);

				stateBreakpoints[breakpointType] = mergeObject(
					breakpoints[breakpointType],
					{
						attributes: preparedPathValue,
					}
				);
			} else {
				stateBreakpoints[breakpointType] = mergeObject(
					breakpoints[breakpointType],
					{
						attributes: {
							[attributeId]: isEquals(newValue, ref.defaultValue)
								? undefined
								: newValue,
						},
					}
				);
			}
		}
		console.log(stateBreakpoints);
		blockeraBlockStates[stateType] = mergeObject(
			blockStates[stateType],
			{
				breakpoints: stateBreakpoints,
			},
			{
				deletedProps: [
					attributeId,
					// FIXME: uncomment after fixed cleanup breakpoint.
					// ...Object.keys(_state.breakpoints),
				],
			}
		);
	}

	return {
		...state,
		[attributeId]: newValue,
		blockeraBlockStates,
	};
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

export const resetCurrentState = (_state: Object, action: Object): Object => {
	const {
		newValue,
		attributeId,
		currentState,
		currentBlock,
		currentBreakpoint,
		currentInnerBlockState,
	} = action;

	const state = { ..._state };
	const args = { deletedProps: [attributeId] };

	if (isInnerBlock(currentBlock)) {
		if (
			!isNormalState(currentState) ||
			getBaseBreakpoint() !== currentBreakpoint
		) {
			if (!isNormalState(currentInnerBlockState)) {
				return mergeObject(
					state,
					{
						blockeraBlockStates: {
							[currentState]: {
								breakpoints: {
									attributes: {
										blockeraInnerBlocks: {
											[currentBlock]: {
												attributes: {
													blockeraBlockStates: {
														[currentInnerBlockState]:
															{
																breakpoints: {
																	[currentBreakpoint]:
																		{
																			attributes:
																				{
																					[attributeId]:
																						undefined,
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
							},
						},
					},
					args
				);
			}
			return mergeObject(
				state,
				{
					blockeraBlockStates: {
						[currentState]: {
							breakpoints: {
								[currentBreakpoint]: {
									attributes: {
										blockeraInnerBlocks: {
											[currentBlock]: {
												attributes: {
													[attributeId]: undefined,
												},
											},
										},
									},
								},
							},
						},
					},
				},
				args
			);
		} else if (!isNormalState(currentInnerBlockState)) {
			return mergeObject(
				state,
				{
					blockeraInnerBlocks: {
						[currentBlock]: {
							attributes: {
								blockeraBlockStates: {
									[currentInnerBlockState]: {
										breakpoints: {
											[currentBreakpoint]: {
												attributes: {
													[attributeId]: undefined,
												},
											},
										},
									},
								},
							},
						},
					},
				},
				args
			);
		}

		return mergeObject(
			state,
			{
				blockeraInnerBlocks: {
					[currentBlock]: {
						attributes: {
							[attributeId]: undefined,
						},
					},
				},
			},
			args
		);
	}

	if (
		isNormalState(currentState) &&
		getBaseBreakpoint() === currentBreakpoint
	) {
		return mergeObject(
			state,
			{
				[attributeId]: newValue,
			},
			{ forceUpdated: [attributeId] }
		);
	}

	return mergeObject(
		state,
		{
			blockeraBlockStates: {
				[currentState]: {
					breakpoints: {
						[currentBreakpoint]: {
							attributes: {
								[attributeId]:
									isEquals(state[attributeId], newValue) ||
									(isObject(newValue) && isEmpty(newValue))
										? undefined
										: newValue,
							},
						},
					},
				},
			},
		},
		args
	);
};
