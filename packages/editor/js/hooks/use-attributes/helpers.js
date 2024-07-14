// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { update, prepare } from '@blockera/data-editor';
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
import { blockStatesValueCleanup } from '../../extensions/libs/block-states/helpers';
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
												// FIXME: The "isVisible" is retrieved from the getBlockStates() store API of extensions
												// We need to address the isVisible property in the block-states repeater item,
												// as there is currently no UI for this property in the block-states repeater item.
												isVisible: true,
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
					// FIXME: The "isVisible" is retrieved from the getBlockStates() store API of extensions
					// We need to address the isVisible property in the block-states repeater item,
					// as there is currently no UI for this property in the block-states repeater item.
					isVisible: true,
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
	let blockeraBlockStates: { [key: string]: Object } = {};
	let blockeraInnerBlocks = state?.blockeraInnerBlocks;

	if (isInnerBlock(currentBlock)) {
		const blockStates =
			state.blockeraInnerBlocks[currentBlock].attributes
				?.blockeraBlockStates || {};
		// $FlowFixMe
		for (const stateType: TStates in blockStates) {
			const _state = blockStates[stateType];
			const breakpoints = _state?.breakpoints;
			const stateBreakpoints: { [key: string]: Object } = {};

			// $FlowFixMe
			for (const breakpointType: TBreakpoint in breakpoints) {
				const preparedRefPath = prepare(
					ref.path || '',
					breakpoints[breakpointType].attributes
				);

				if (ref.path && ref.path !== attributeId && preparedRefPath) {
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
								[attributeId]: isEquals(
									newValue,
									ref.defaultValue
								)
									? undefined
									: newValue,
							},
						}
					);
				}
			}

			blockeraBlockStates[stateType] = mergeObject(
				blockStates[stateType],
				{
					breakpoints: stateBreakpoints,
				}
			);
		}

		blockeraInnerBlocks = mergeObject(
			state?.blockeraInnerBlocks || {},
			{
				[currentBlock]: {
					attributes: {
						[attributeId]: isEquals(newValue, ref.defaultValue)
							? undefined
							: newValue,
						blockeraBlockStates,
					},
				},
			},
			{
				deletedProps: [
					attributeId,
					// FIXME: uncomment after fixed cleanup breakpoint.
					// ...Object.keys(_state.breakpoints),
				],
			}
		);

		// cleanup block states stack;
		blockeraBlockStates = {};
	}

	const blockStates = state.blockeraBlockStates;

	// $FlowFixMe
	for (const stateType: TStates in blockStates) {
		const breakpoints = blockStates[stateType].breakpoints;
		const stateBreakpoints: { [key: string]: Object } = {};

		// $FlowFixMe
		for (const breakpointType: TBreakpoint in breakpoints) {
			const dataset = breakpoints[breakpointType].attributes;

			if (
				isInnerBlock(currentBlock) &&
				dataset?.blockeraInnerBlocks[currentBlock]
			) {
				const blockStates =
					dataset.blockeraInnerBlocks[currentBlock].attributes
						?.blockeraBlockStates || {};

				// $FlowFixMe
				for (const _stateType: TStates in blockStates) {
					const _state = blockStates[_stateType];
					const _breakpoints = _state?.breakpoints;

					// $FlowFixMe
					for (const _breakpointType: TBreakpoint in _breakpoints) {
						const _preparedRefPath = prepare(
							ref.path || '',
							_breakpoints[breakpointType].attributes
						);

						if (
							ref.path &&
							ref.path !== attributeId &&
							_preparedRefPath
						) {
							const _preparedPathValue = update(
								_breakpoints[_breakpointType].attributes,
								ref.path,
								ref.defaultValue
							);

							stateBreakpoints[breakpointType] = mergeObject(
								breakpoints[breakpointType],
								{
									attributes: {
										blockeraInnerBlocks: {
											[currentBlock]: {
												attributes: {
													blockeraBlockStates: {
														// $FlowFixMe
														[_stateType]: {
															breakpoints: {
																// $FlowFixMe
																[_breakpointType]:
																	{
																		attributes:
																			_preparedPathValue,
																	},
															},
														},
													},
												},
											},
										},
									},
								}
							);

							//_preparedPathValue
						} else {
							stateBreakpoints[breakpointType] = mergeObject(
								breakpoints[breakpointType],
								{
									attributes: {
										blockeraInnerBlocks: {
											[currentBlock]: {
												attributes: {
													[attributeId]: isEquals(
														newValue,
														ref.defaultValue
													)
														? undefined
														: newValue,
													blockeraBlockStates: {
														// $FlowFixMe
														[_stateType]: {
															breakpoints: {
																// $FlowFixMe
																[_breakpointType]:
																	{
																		attributes:
																			{
																				[attributeId]:
																					isEquals(
																						newValue,
																						ref.defaultValue
																					)
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
								}
							);
						}
					}
				}

				continue;
			}

			const preparedRefPath = prepare(ref.path || '', dataset);

			if (ref.path && ref.path !== attributeId && preparedRefPath) {
				const preparedPathValue = update(
					dataset,
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
		...(isInnerBlock(currentBlock)
			? {
					blockeraInnerBlocks,
			  }
			: {}),
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
		ref,
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
									[currentBreakpoint]: {
										attributes: {
											blockeraInnerBlocks: {
												[currentBlock]: {
													attributes: {
														blockeraBlockStates: {
															[currentInnerBlockState]:
																{
																	breakpoints:
																		{
																			[currentBreakpoint]:
																				{
																					attributes:
																						{
																							[attributeId]:
																								isEquals(
																									newValue,
																									ref.defaultValue
																								)
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
													[attributeId]: isEquals(
														newValue,
														ref.defaultValue
													)
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
													[attributeId]: isEquals(
														newValue,
														ref.defaultValue
													)
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
