// @flow
/**
 * External dependencies
 */
import { select, useSelect } from '@wordpress/data';

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
import { isInnerBlock } from '../../../components';

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

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { currentBlock } = useSelect((select) => {
		const { getExtensionCurrentBlock } = select(
			'publisher-core/extensions'
		);

		return {
			currentBlock: getExtensionCurrentBlock(),
		};
	});

	const { getExtensionCurrentBlockStateBreakpoint } = select(
		'publisher-core/extensions'
	);
	const breakpoints = getBreakpoints();

	const normals = [];
	let blockAttributes = block.attributes;
	let publisherBlockStates = blockAttributes.publisherBlockStates;

	if (isInnerBlock(currentBlock)) {
		blockAttributes =
			blockAttributes.publisherInnerBlocks[currentBlock].attributes;
		publisherBlockStates =
			blockAttributes.publisherBlockStates ||
			block.attributes.publisherBlockStates;
	}

	return Object.values(breakpoints)
		.map((breakpoint: BreakpointTypes): StateGraph => {
			let states: StateGraphStates = [];

			states = Object.values(publisherBlockStates)
				.map((state: StateTypes): State => {
					if (
						'normal' === state.type &&
						breakpoint.type ===
							getExtensionCurrentBlockStateBreakpoint()
					) {
						return {
							type: state.type,
							label: state.label,
							attributes: omit(blockAttributes, [
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
