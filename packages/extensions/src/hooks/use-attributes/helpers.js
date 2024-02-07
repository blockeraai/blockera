// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';

/**
 * Publisher dependencies
 */
import { isInnerBlock } from '../../components';
import { deletePropertyByPath, isEquals } from '@publisher/utils';
import type {
	StateTypes,
	BreakpointTypes,
} from '../../libs/block-states/types';
import type { InnerBlockModel } from '../../libs/inner-blocks/types';

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
	id: number,
	action: Object
) => BreakpointTypes = memoize(
	(
		breakpoint,
		id,
		{
			ref,
			state,
			newValue,
			stateType,
			updateItems,
			attributeId,
			currentBlock,
			breakpointId,
			breakpointType,
		}
	) => {
		if (breakpointType && breakpointType !== breakpoint.type) {
			return breakpoint;
		}

		if (breakpointId !== id) {
			return breakpoint;
		}

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

		if (stateType && breakpointType && isInnerBlock(currentBlock)) {
			return {
				...breakpoint,
				attributes: {
					...breakpoint.attributes,
					publisherInnerBlocks: state.publisherInnerBlocks.map(
						(innerBlock) => {
							if (innerBlock.type !== currentBlock) {
								return innerBlock;
							}

							return {
								...innerBlock,
								attributes: {
									...innerBlock.attributes,
									[attributeId]: newValue,
								},
							};
						}
					),
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
		const { blockStateId, stateType } = action;

		return currentBlockAttributes.publisherBlockStates.map((state, id) => {
			if (stateType && stateType !== state.type) {
				return state;
			}

			if (blockStateId !== id) {
				return state;
			}

			return {
				...state,
				breakpoints: state.breakpoints.map((breakpoint, id) =>
					memoizedRootBreakpoints(breakpoint, id, action)
				),
			};
		});
	}
);

export const getInnerBlocks: (
	innerBlock: InnerBlockModel,
	root: Object,
	action: Object
) => false | Object = memoize(
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
			addOrModifyRootItems,
		} = action;

		if (innerBlock.type !== currentBlock) {
			return false;
		}

		if (ref?.current?.reset) {
			return {
				...innerBlock,
				attributes: resetAttribute(innerBlock.attributes),
			};
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

		const oldInnerBlockAttributes =
			'undefined' !== typeof root?.attributes &&
			root?.attributes.hasOwnProperty('publisherInnerBlocks')
				? root?.attributes?.publisherInnerBlocks.find(
						(block: InnerBlockModel): boolean =>
							block.type === innerBlock.type
				  )?.attributes || {}
				: null;

		if (
			oldInnerBlockAttributes &&
			!isChanged(oldInnerBlockAttributes, attributeId, newValue, {
				attributeId: null,
			})
		) {
			return root;
		}

		return {
			...innerBlock,
			attributes: {
				...(oldInnerBlockAttributes || {}),
				...addOrModifyRootItems,
				[attributeId]: newValue,
			},
		};
	}
);

export const getBreakPoints: (
	breakpoint: BreakpointTypes,
	action: Object,
	state: Object
) => BreakpointTypes = memoize(
	(
		breakpoint: BreakpointTypes,
		action: Object,
		state: Object
	): BreakpointTypes => {
		const { breakpointType, type, attributeId, newValue } = action;

		if (breakpoint.type !== breakpointType) {
			return breakpoint;
		}

		if ('UPDATE_INNER_BLOCK_INSIDE_PARENT_STATE' !== type) {
			return {
				...breakpoint,
				attributes: {
					...breakpoint.attributes,
					[attributeId]: newValue,
				},
			};
		}

		let oldInnerBlocks = state.publisherInnerBlocks;

		if (!oldInnerBlocks?.length) {
			oldInnerBlocks = action.publisherInnerBlocks;
		}

		const publisherInnerBlocks = oldInnerBlocks
			.map((innerBlock: InnerBlockModel) =>
				getInnerBlocks(innerBlock, breakpoint, action)
			)
			.filter((innerBlock): boolean => innerBlock);

		return {
			...breakpoint,
			attributes: {
				...breakpoint.attributes,
				publisherInnerBlocks,
			},
		};
	}
);

export const getBlockStates: (
	params: { blockStates: Array<StateTypes> },
	action: Object,
	state: Object
) => Array<StateTypes> = memoize(
	(
		{ blockStates }: { blockStates: Array<StateTypes> },
		action: Object,
		state: Object
	) => {
		const { stateType } = action;

		return blockStates.map((blockState: StateTypes): StateTypes => {
			if (blockState.type !== stateType) {
				return blockState;
			}

			const breakpoints = blockState.breakpoints.map(
				(breakpoint: BreakpointTypes): BreakpointTypes =>
					getBreakPoints(breakpoint, action, state)
			);

			return {
				...blockState,
				breakpoints,
			};
		});
	}
);
