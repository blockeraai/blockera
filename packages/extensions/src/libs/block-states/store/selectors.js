// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';

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
import { isEmpty, isEquals, omit } from '@publisher/utils';

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

export type StateGraphStates = Array<StateGraphItem>;

export type StateGraph = {
	type: TBreakpoint,
	label: TBreakpointLabel,
	icon: {
		library: string,
		icon: string,
	},
	states: StateGraphStates,
};

export const getBlockStates = (): Array<StateGraph> => {
	const { getSelectedBlock } = select('core/block-editor');

	const block = getSelectedBlock();

	if (!block) {
		return [];
	}

	const breakpoints = getBreakpoints();

	const normals = [];

	return breakpoints
		.map((breakpoint: BreakpointTypes): StateGraph => {
			const states = block.attributes.publisherBlockStates
				.map((state: StateTypes): State => {
					if ('normal' === state.type) {
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
						attributes: state.breakpoints.find(
							(b: BreakpointTypes): boolean => {
								return b.type === breakpoint.type;
							}
						)?.attributes,
					};
				})
				.filter((state: State): boolean => !isEmpty(state.attributes));

			return {
				type: breakpoint.type,
				label: breakpoint.label,
				icon: {
					library: 'wp',
					icon: '',
				},
				states,
			};
		})
		.map((graph: StateGraph): StateGraph => {
			return {
				...graph,
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
