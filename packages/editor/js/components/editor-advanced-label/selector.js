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

	const { getExtensionCurrentBlock } = select('blockera/extensions');
	const { getBreakpoints } = select('blockera/editor');

	const currentBlock = getExtensionCurrentBlock();

	const breakpoints = getBreakpoints();
	const normals = [];

	const blockAttributes = block.attributes;
	const blockeraBlockStates: { [key: TStates]: StateTypes } =
		blockAttributes?.blockeraBlockStates;

	const graphStates: Array<{
		type: TBreakpoint,
		label: string,
		states: { type: TStates, label: string, attributes: Object },
	}> = [];

	// $FlowFixMe
	for (const breakpointType: TBreakpoint in breakpoints) {
		const breakpoint = breakpoints[breakpointType];
		const states: StateGraphStates = [];

		if (
			!isInnerBlock(currentBlock) &&
			getBaseBreakpoint() === breakpoint.type
		) {
			// $FlowFixMe
			states.push({
				type: 'normal',
				label: staticStates.normal.label,
				attributes: omit(blockAttributes, ['blockeraBlockStates']),
			});
		}

		const innerBlockAttributes =
			prepare(
				`blockeraInnerBlocks[${currentBlock}].attributes`,
				blockAttributes
			) || {};

		if (isInnerBlock(currentBlock) && !isEmpty(innerBlockAttributes)) {
			const innerBlockStates =
				innerBlockAttributes?.blockeraBlockStates || {};

			if (getBaseBreakpoint() === breakpoint.type) {
				// $FlowFixMe
				states.push({
					type: 'normal',
					label: staticStates.normal.label,
					attributes: omit(innerBlockAttributes, [
						'blockeraBlockStates',
					]),
				});
			}

			// $FlowFixMe
			for (const stateType: TStates in innerBlockStates) {
				const state = innerBlockStates[stateType];

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
		}

		// $FlowFixMe
		for (const stateType: TStates in blockeraBlockStates) {
			const state = blockeraBlockStates[stateType];

			if (!state || !state.breakpoints[breakpointType]) {
				continue;
			}

			if (
				isInnerBlock(currentBlock) &&
				state.breakpoints[breakpoint.type]?.attributes &&
				state.breakpoints[breakpoint.type]?.attributes
					?.blockeraInnerBlocks[currentBlock]
			) {
				const currentAttributes =
					state.breakpoints[breakpoint.type]?.attributes
						?.blockeraInnerBlocks[currentBlock]?.attributes;

				// $FlowFixMe
				states.push({
					type: 'normal',
					label: staticStates.normal.label,
					attributes: currentAttributes,
				});

				// $FlowFixMe
				for (const _stateType: TStates in currentAttributes?.blockeraBlockStates ||
					{}) {
					const _state =
						currentAttributes?.blockeraBlockStates[_stateType];

					if (!_state || !_state.breakpoints[breakpointType]) {
						continue;
					}

					// $FlowFixMe
					states.push({
						type: _stateType,
						label: staticStates[_stateType].label,
						attributes:
							_state.breakpoints[breakpoint.type]?.attributes,
					});
				}
			} else {
				// $FlowFixMe
				states.push({
					type: stateType,
					label: staticStates[stateType].label,
					attributes: state.breakpoints[breakpoint.type]?.attributes,
				});
			}
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
