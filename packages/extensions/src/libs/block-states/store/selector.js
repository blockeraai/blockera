// @flow
/**
 * External dependencies
 */
import { select, useSelect } from '@wordpress/data';

/**
 * Blockera dependencies
 */
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
} from '../types';
import staticStates from '../states';
import getBreakpoints from '../default-breakpoints';
import { isInnerBlock } from '../../../components/utils';

export type State = {
	type: TStates,
	label: TStatesLabel,
	attributes: Object,
};

export type StateGraphItem = {
	id: number,
	type: TStates,
	force: boolean,
	settings: Object,
	attributes: Object,
	label: TStatesLabel,
	breakpoints: BreakpointTypes,
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

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { currentBlock } = useSelect((select) => {
		const { getExtensionCurrentBlock } = select('blockera-core/extensions');

		return {
			currentBlock: getExtensionCurrentBlock(),
		};
	});

	const { getExtensionCurrentBlockStateBreakpoint } = select(
		'blockera-core/extensions'
	);
	const breakpoints = getBreakpoints();

	const normals = [];
	let blockAttributes = block.attributes;
	let blockeraBlockStates: { [key: TStates]: StateTypes } =
		blockAttributes.blockeraBlockStates;

	if (isInnerBlock(currentBlock)) {
		blockAttributes =
			blockAttributes.blockeraInnerBlocks[currentBlock].attributes;
		blockeraBlockStates =
			blockAttributes.blockeraBlockStates ||
			block.attributes.blockeraBlockStates;
	}

	return Object.values(breakpoints)
		.map((breakpoint: BreakpointTypes): StateGraph => {
			let states: StateGraphStates = [];

			states = Object.entries(blockeraBlockStates)
				.map(([stateType, state]: [TStates, StateTypes]): State => {
					if (
						'normal' === stateType &&
						breakpoint.type ===
							getExtensionCurrentBlockStateBreakpoint()
					) {
						return {
							type: stateType,
							label: staticStates[stateType].label,
							attributes: omit(blockAttributes, [
								'blockeraBlockStates',
							]),
						};
					}

					return {
						type: stateType,
						label: staticStates[stateType].label,
						attributes:
							state.breakpoints[breakpoint.type]?.attributes,
					};
				})
				// $FlowFixMe
				.filter((state: State): boolean => !isEmpty(state.attributes));

			return {
				type: breakpoint.type,
				label: breakpoint.label,
				states,
			};
		})
		.map((graph: StateGraph): StateGraph => {
			if (!graph.states.length) {
				return graph;
			}

			return {
				...graph,
				// $FlowFixMe
				states: graph.states.filter(
					(state: { ...State, ...StateGraphItem }): boolean => {
						if (
							'normal' === state.type &&
							!isEmpty(normals) &&
							isEmpty(
								normals.filter(
									(normal) =>
										!isEquals(normal, state.attributes)
								)
							)
						) {
							return false;
						}

						if ('normal' === state.type) {
							normals.push(state.attributes);
						}

						return true;
					}
				),
			};
		});
};
