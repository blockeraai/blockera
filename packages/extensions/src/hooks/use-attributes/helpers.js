// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';

/**
 * Publisher dependencies
 */
import { isEquals } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { isInnerBlock } from '../../components';
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
		{ newValue, attributeId, currentBlock },
		insideInnerBlock: boolean = false
	) => {
		if (isInnerBlock(currentBlock) && !insideInnerBlock) {
			return {
				...breakpoint,
				attributes: {
					...breakpoint.attributes,
					publisherInnerBlocks: {
						...(breakpoint.attributes?.publisherInnerBlocks || {}),
						[currentBlock]: {
							...(breakpoint.attributes?.publisherInnerBlocks &&
							breakpoint.attributes?.publisherInnerBlocks[
								currentBlock
							]
								? breakpoint.attributes?.publisherInnerBlocks[
										currentBlock
								  ]
								: {}),
							attributes: {
								...(breakpoint.attributes
									?.publisherInnerBlocks &&
								breakpoint.attributes?.publisherInnerBlocks[
									currentBlock
								] &&
								breakpoint.attributes?.publisherInnerBlocks[
									currentBlock
								]?.attributes
									? breakpoint.attributes
											?.publisherInnerBlocks[currentBlock]
											?.attributes
									: {}),
								[attributeId]: newValue,
							},
						},
					},
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
	action: Object,
	insideInnerBlock?: boolean
) => Array<StateTypes> = memoize(
	(
		currentBlockAttributes: Object,
		action: Object,
		insideInnerBlock: boolean = false
	) => {
		const { currentState, currentBreakpoint, currentInnerBlockState } =
			action;
		const stateType = insideInnerBlock
			? currentInnerBlockState
			: currentState;
		const breakpoints =
			currentBlockAttributes?.publisherBlockStates[stateType]
				?.breakpoints;

		return {
			...currentBlockAttributes?.publisherBlockStates,
			//$FlowFixMe
			[stateType]: {
				...currentBlockAttributes?.publisherBlockStates[stateType],
				breakpoints: {
					...breakpoints,
					[currentBreakpoint]: memoizedRootBreakpoints(
						breakpoints[currentBreakpoint],
						action,
						insideInnerBlock
					),
				},
			},
		};
	}
);
