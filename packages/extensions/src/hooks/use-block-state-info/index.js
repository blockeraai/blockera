// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';

/**
 * Internal dependencies
 */
import type {
	StateTypes,
	BreakpointTypes,
} from '../../libs/block-states/types';
import { isInnerBlock } from '../../components';
import { indexOf } from '@publisher/utils';
import type { BlockStateInfo, BlockStateInfoProps } from './types';

export const useBlockStateInfo = ({
	attributes,
	currentBlock,
	currentInnerBlock,
}: BlockStateInfoProps): BlockStateInfo => {
	if (
		isInnerBlock(currentBlock) &&
		'undefined' ===
			typeof currentInnerBlock?.attributes?.publisherBlockStates
	) {
		return {
			blockStateId: 0, // normal
			breakpointId: 3, // laptop
			currentStateIndex: 0,
		};
	}

	let blockStateId;
	let breakpointId;
	let blockStateTypes;
	let currentStateIndex;

	const getMemoizedBlockStateTypes = memoize((blockStates) =>
		blockStates.map((state: StateTypes) => state.type)
	);

	const getMemoizedStateBreakpoints = memoize(
		(states, stateId) => states[stateId]?.breakpoints
	);

	const getMemoizedStateBreakpointTypes = memoize((breakpoints) =>
		breakpoints?.map((breakpoint: BreakpointTypes) => breakpoint.label)
	);

	if (isInnerBlock(currentBlock)) {
		blockStateTypes = getMemoizedBlockStateTypes(
			currentInnerBlock?.attributes?.publisherBlockStates
		);

		currentStateIndex = blockStateTypes?.indexOf(
			currentInnerBlock?.attributes?.publisherCurrentState
		);
		blockStateId = -1 === currentStateIndex ? 0 : currentStateIndex;

		breakpointId = indexOf(
			getMemoizedStateBreakpointTypes(
				getMemoizedStateBreakpoints(
					currentInnerBlock?.attributes?.publisherBlockStates,
					blockStateId
				)
			),
			'laptop'
		);
	} else {
		blockStateTypes = getMemoizedBlockStateTypes(
			attributes?.publisherBlockStates
		);

		currentStateIndex = blockStateTypes?.indexOf(
			attributes?.publisherCurrentState
		);
		blockStateId = -1 === currentStateIndex ? 0 : currentStateIndex;

		breakpointId = indexOf(
			getMemoizedStateBreakpointTypes(
				getMemoizedStateBreakpoints(
					attributes?.publisherBlockStates,
					blockStateId
				)
			),
			'laptop'
		);
	}

	return {
		blockStateId,
		breakpointId,
		currentStateIndex,
	};
};
