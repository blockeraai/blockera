// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';

/**
 * Publisher dependencies
 */
import { isInnerBlock, isNormalState } from '../../components';
import { deletePropertyByPath, isEquals } from '@publisher/utils';
import type {
	TStates,
	StateTypes,
	BreakpointTypes,
} from '../../libs/block-states/types';
import type {
	InnerBlocks,
	InnerBlockModel,
} from '../../libs/inner-blocks/types';
import type { GetBlockStatesParams } from './types';

export const deleteExtraItems = (items: Array<string>, from: Object): void => {
	if (items?.length) {
		// Assume existed deleteItems.
		for (let i = 0; i < items?.length; i++) {
			deletePropertyByPath(from, items[i]);
		}
	}
};

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

// Reset attribute.
export const resetAttribute = (
	{ attributes, deleteItemsOnResetAction }: Object,
	ref: Object
): Object => {
	const newAttributes = {
		...attributes,
	};

	deletePropertyByPath(
		newAttributes,
		ref.current.path.replace(/\[/g, '.').replace(/]/g, '')
	);

	// if handler has deleteItemsOnResetAction.
	deleteExtraItems(deleteItemsOnResetAction, newAttributes);

	return newAttributes;
};

export const memoizedRootBreakpoints: (
	breakpoint: BreakpointTypes,
	action: Object
) => BreakpointTypes = memoize(
	(
		breakpoint,
		{
			ref,
			state,
			newValue,
			updateItems,
			attributeId,
			currentBlock,
			currentState,
			currentBreakpoint,
		}
	) => {
		if (ref?.current?.reset) {
			return {
				...breakpoint,
				attributes: resetAttribute(breakpoint.attributes),
			};
		}

		if (
			'object' === typeof updateItems &&
			Object.values(updateItems)?.length
		) {
			breakpoint = {
				...breakpoint,
				attributes: {
					...breakpoint.attributes,
					...updateItems,
				},
			};
		}

		if (
			!isChanged(breakpoint.attributes, attributeId, newValue, {
				[attributeId]: null,
			})
		) {
			return breakpoint;
		}

		if (currentState && currentBreakpoint && isInnerBlock(currentBlock)) {
			if (state.publisherInnerBlocks[currentBlock]) {
				state.publisherInnerBlocks[currentBlock] = {
					...state.publisherInnerBlocks[currentBlock],
					attributes: {
						...state.publisherInnerBlocks[currentBlock].attributes,
						[attributeId]: newValue,
					},
				};
			}

			return {
				...breakpoint,
				attributes: {
					...breakpoint.attributes,
					publisherInnerBlocks: state.publisherInnerBlocks,
				},
			};
		}

		return {
			...breakpoint,
			attributes: {
				...breakpoint.attributes,
				[attributeId]: newValue,
			},
		};
	}
);

export const memoizedBlockStates: (
	currentBlockAttributes: Object,
	action: Object
) => Array<StateTypes> = memoize(
	(currentBlockAttributes: Object, action: Object) => {
		const { currentState, currentBreakpoint } = action;
		const breakpoints =
			currentBlockAttributes?.publisherBlockStates[currentState]
				?.breakpoints;

		return {
			...currentBlockAttributes?.publisherBlockStates,
			[currentState]: {
				...currentBlockAttributes?.publisherBlockStates[currentState],
				breakpoints: {
					...breakpoints,
					[currentBreakpoint]: memoizedRootBreakpoints(
						breakpoints[currentBreakpoint],
						action
					),
				},
			},
		};
	}
);

export const getUpdatedInnerBlock: (
	innerBlock: InnerBlockModel,
	root: Object,
	action: Object
) => InnerBlocks = memoize(
	(
		innerBlock: InnerBlockModel,
		root: Object,
		action: Object
	): false | Object => {
		const {
			ref,
			newValue,
			attributeId,
			updateItems,
			currentBlock,
			currentBreakpoint,
			currentInnerBlockState,
			attributeIsRelatedStatesAttributes,
		} = action;

		if (ref?.current?.reset) {
			innerBlock.attributes = resetAttribute(innerBlock.attributes);

			return innerBlock;
		}

		if (
			'object' === typeof updateItems &&
			Object.values(updateItems)?.length
		) {
			innerBlock = {
				...innerBlock,
				attributes: {
					...innerBlock.attributes,
					...updateItems,
				},
			};
		}

		if (
			!isChanged(
				root?.attributes?.publisherInnerBlocks
					? root?.attributes?.publisherInnerBlocks[currentBlock]
							?.attributes
					: undefined,
				attributeId,
				newValue,
				{
					attributeId: null,
				}
			)
		) {
			return innerBlock;
		}

		if (!innerBlock.attributes) {
			innerBlock.attributes = {};
		}

		if (
			isNormalState(currentInnerBlockState) ||
			attributeIsRelatedStatesAttributes
		) {
			innerBlock.attributes[attributeId] = newValue;
		} else {
			if (
				!innerBlock.attributes.publisherBlockStates[
					currentInnerBlockState
				]
			) {
				innerBlock.attributes.publisherBlockStates[
					currentInnerBlockState
				] = {
					breakpoints: {
						[currentBreakpoint]: {
							attributes: {},
						},
					},
				};
			}

			innerBlock.attributes.publisherBlockStates[
				currentInnerBlockState
			].breakpoints[currentBreakpoint].attributes[attributeId] = newValue;
		}

		return innerBlock;
	}
);

export const getUpdatedBreakPoint: (
	breakpoint: BreakpointTypes,
	action: Object,
	state: Object
) => BreakpointTypes = memoize(
	(
		breakpoint: BreakpointTypes,
		action: Object,
		state: Object
	): BreakpointTypes => {
		const { type, attributeId, newValue, currentBlock } = action;

		if ('UPDATE_INNER_BLOCK_INSIDE_PARENT_STATE' !== type) {
			if (!breakpoint.attributes) {
				breakpoint.attributes = {};
			}

			breakpoint.attributes[attributeId] = newValue;

			return breakpoint;
		}

		if (
			!breakpoint.attributes ||
			!breakpoint.attributes.publisherInnerBlocks
		) {
			breakpoint.attributes = {
				publisherInnerBlocks: {},
			};
		}

		breakpoint.attributes.publisherInnerBlocks[currentBlock] =
			getUpdatedInnerBlock(
				breakpoint.attributes.publisherInnerBlocks[currentBlock] ||
					state.publisherInnerBlocks[currentBlock] ||
					{},
				breakpoint,
				action
			);

		return breakpoint;
	}
);

export const getUpdatedBlockStates: (
	params: GetBlockStatesParams,
	action: Object,
	state: Object
) => { [key: TStates]: StateTypes } = memoize(
	(
		{ states, inInnerBlock = false }: GetBlockStatesParams,
		action: Object,
		state: Object
	) => {
		const { currentState, currentBreakpoint, currentInnerBlockState } =
			action;

		const getUpdatedBlockStates = (
			states: {
				[key: TStates]: StateTypes,
			},
			stateType: TStates
		): { [key: TStates]: StateTypes } => {
			states[stateType].breakpoints[currentBreakpoint] =
				getUpdatedBreakPoint(
					states[stateType].breakpoints[currentBreakpoint],
					action,
					state
				);

			return states;
		};

		if (inInnerBlock) {
			return getUpdatedBlockStates(states, currentInnerBlockState);
		}

		return getUpdatedBlockStates(states, currentState);
	}
);
