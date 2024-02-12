// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Publisher dependencies
 */
import { isEmpty, isEquals, omit } from '@publisher/utils';

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
import getBreakpoints from '../default-breakpoints';

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

export const getBlockStates = (): Array<StateGraph> => {
	const { getSelectedBlock } = select('core/block-editor');

	const block = getSelectedBlock();

	if (!block) {
		return [];
	}

	const { getExtensionCurrentBlockStateBreakpoint } = select(
		'publisher-core/extensions'
	);
	const breakpoints = getBreakpoints();

	const normals = [];

	return Object.values(breakpoints)
		.map((breakpoint: BreakpointTypes): StateGraph => {
			let states: StateGraphStates = [];

			states = Object.values(block.attributes.publisherBlockStates)
				.map((state: StateTypes): State => {
					if (
						'normal' === state.type &&
						breakpoint.type ===
							getExtensionCurrentBlockStateBreakpoint()
					) {
						return {
							type: state.type,
							label: state.label,
							attributes: omit(block.attributes, [
								'publisherBlockStates',
							]),
						};
					}

					return {
						type: state.type,
						label: state.label,
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
