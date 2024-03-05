// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';

/**
 * Publisher dependencies
 */
import { isEquals, mergeObject } from '@publisher/utils';

/**
 * Internal dependencies
 */
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
				if ('publisherBlockStates' === attributeId) {
					return mergeObject(breakpoint, {
						attributes: {
							publisherInnerBlocks: {
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

				return mergeObject(breakpoint, {
					attributes: {
						publisherInnerBlocks: {
							[currentBlock]: {
								attributes: {
									publisherBlockStates: {
										[currentInnerBlockState]: {
											breakpoints: {
												[currentBreakpoint]: {
													attributes: {
														...effectiveItems,
														[attributeId]: newValue,
													},
												},
											},
										},
									},
								},
							},
						},
					},
				});
			}

			return mergeObject(breakpoint, {
				attributes: {
					publisherInnerBlocks: {
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

		return mergeObject(breakpoint, {
			attributes: {
				...effectiveItems,
				[attributeId]: newValue,
			},
		});
	}
);

export const memoizedBlockStates: (
	currentBlockAttributes: Object,
	action: Object,
	insideInnerBlock?: boolean
) => Array<StateTypes> = memoize(
	(
		currentBlockAttributes: Object,
		action: Object,
		insideInnerBlock?: boolean = false
	): Object => {
		const { currentState, currentBreakpoint } = action;
		const breakpoints =
			currentBlockAttributes?.publisherBlockStates[currentState]
				?.breakpoints;

		return mergeObject(currentBlockAttributes?.publisherBlockStates, {
			[currentState]: {
				breakpoints: {
					[currentBreakpoint]: memoizedRootBreakpoints(
						breakpoints[currentBreakpoint],
						action,
						insideInnerBlock
					),
				},
			},
		});
	}
);
