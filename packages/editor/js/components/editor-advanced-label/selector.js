// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { prepare } from '@blockera/data-editor';
import { isEmpty, isEquals, omit } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type {
	BreakpointTypes,
	StateTypes,
	TBreakpoint,
	TBreakpointLabel,
	TStates,
	TStatesLabel,
} from '../../extensions/libs/block-states/types';
import { getBaseBreakpoint } from '../../canvas-editor';
import staticStates from '../../extensions/libs/block-states/states';
import { isInnerBlock, isNormalState } from '../../extensions/components/utils';
import { isNormalStateOnBaseBreakpoint } from '../../extensions/libs/block-states/helpers';

export type State = {
	type: TStates,
	label: TStatesLabel,
	attributes: Object,
};

export type StateGraphItem = {
	id?: number,
	type?: TStates,
	force?: boolean,
	settings?: Object,
	attributes: Object,
	label: TStatesLabel,
	breakpoints?: BreakpointTypes,
};

export type StateGraphStates = Array<StateGraphItem> | [];

export type StateGraph = {
	type: TBreakpoint,
	label: TBreakpointLabel,
	states: StateGraphStates,
};

export const getStatesGraphNodes = (): Array<StateGraph> => {
	const { getSelectedBlock } = select('core/block-editor');

	const block = getSelectedBlock();

	if (!block) {
		return [];
	}

	const {
		getExtensionCurrentBlock,
		getExtensionCurrentBlockState,
		getExtensionCurrentBlockStateBreakpoint,
	} = select('blockera/extensions');
	const { getBreakpoints } = select('blockera/editor');

	const currentBlock = getExtensionCurrentBlock();
	const currentState = getExtensionCurrentBlockState();
	const currentBreakpoint = getExtensionCurrentBlockStateBreakpoint();

	const breakpoints = getBreakpoints();
	const normals = [];

	let blockAttributes = block.attributes;
	let blockeraBlockStates: { [key: TStates]: StateTypes } =
		blockAttributes?.blockeraBlockStates;

	if (isInnerBlock(currentBlock)) {
		if (!isNormalStateOnBaseBreakpoint(currentState, currentBreakpoint)) {
			blockAttributes =
				prepare(
					`blockeraBlockStates[${currentState}].breakpoints[${currentBreakpoint}].attributes.blockeraInnerBlocks[${currentBlock}].attributes`,
					blockAttributes
				) || {};
		} else {
			blockAttributes =
				prepare(
					`blockeraInnerBlocks[${currentBlock}].attributes`,
					blockAttributes
				) || {};
		}

		blockeraBlockStates =
			blockAttributes.blockeraBlockStates ||
			block.attributes.blockeraBlockStates;
	}

	const graphStates: Array<{
		type: TBreakpoint,
		label: string,
		states: { type: TStates, label: string, attributes: Object },
	}> = [];

	// $FlowFixMe
	for (const breakpointType: TBreakpoint in breakpoints) {
		const breakpoint = breakpoints[breakpointType];
		const states: StateGraphStates = [];

		if (getBaseBreakpoint() === breakpoint.type) {
			// $FlowFixMe
			states.push({
				type: 'normal',
				label: staticStates.normal.label,
				attributes: omit(blockAttributes, ['blockeraBlockStates']),
			});
		}

		// $FlowFixMe
		for (const stateType: TStates in blockeraBlockStates) {
			const state = blockeraBlockStates[stateType];

			if (!state || !state.breakpoints[breakpointType]) {
				continue;
			}

			// $FlowFixMe
			states.push({
				type: stateType,
				label: staticStates[stateType].label,
				attributes: state.breakpoints[breakpoint.type]?.attributes,
			});
		}

		graphStates.push({
			type: breakpointType,
			label: breakpoint.label,
			// $FlowFixMe
			states: states.filter(
				(state: State): boolean => !isEmpty(state.attributes)
			),
		});
	}

	const graphNodes: Array<Object> = [];

	for (const graph of graphStates) {
		// $FlowFixMe
		if (!graph.states?.length) {
			continue;
		}

		graphNodes.push({
			...graph,
			// $FlowFixMe
			states: graph.states.filter(
				(state: { ...State, ...StateGraphItem }): boolean => {
					if (
						isNormalState(state.type) &&
						!isEmpty(normals) &&
						isEmpty(
							normals.filter(
								(normal) => !isEquals(normal, state.attributes)
							)
						)
					) {
						return false;
					}

					if (isNormalState(state.type)) {
						normals.push(state.attributes);
					}

					return true;
				}
			),
		});
	}

	return graphNodes;
};
