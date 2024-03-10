// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Publisher dependencies
 */
import { isEmpty, isEquals, isNull, isUndefined } from '@publisher/utils';
import {
	getStatesGraphNodes,
	type StateGraph,
	type StateGraphItem,
} from '@publisher/extensions/src/libs/block-states/store/selector';
/**
 * Internal dependencies
 */
import type { LabelStates, LabelChangedStates } from './types';

export const getStatesGraph = ({
	controlId,
	blockName,
	defaultValue,
}: {
	controlId: string,
	blockName: string,
	defaultValue: any,
}): Array<LabelStates> => {
	const blockStates = controlId ? getStatesGraphNodes() : [];

	const { getBlockType } = select('core/blocks');

	return (
		blockStates
			?.map(
				(stateGraph: StateGraph, index: number): null | LabelStates => {
					if (isEmpty(stateGraph.states)) {
						return null;
					}

					const stateStack = [];

					const changedStates: LabelChangedStates = stateGraph.states
						?.map(
							(
								state,
								_index
							): { id: number, ...StateGraphItem } | null => {
								if (stateStack.includes(state?.type)) {
									return null;
								}

								if (
									isEmpty(state.attributes) ||
									isUndefined(state.attributes) ||
									isNull(state.attributes)
								) {
									return null;
								}

								if (
									!state.attributes.hasOwnProperty(controlId)
								) {
									return null;
								}

								const value = state.attributes[controlId];

								if (!defaultValue) {
									defaultValue =
										getBlockType(blockName)?.attributes[
											controlId
										]?.default;
								}

								if (isEquals(value, defaultValue)) {
									return null;
								}

								stateStack.push(state.type);

								return {
									...state,
									id: _index,
								};
							}
						)
						// $FlowFixMe
						.filter((item: any): boolean => null !== item);

					const isChangedState = (activeState: string) =>
						// $FlowFixMe
						changedStates.find(
							(item): boolean => item.type === activeState
						);

					// no changes
					if (changedStates.length === 0) {
						return null;
					}

					return {
						controlId,
						graph: {
							...stateGraph,
							id: index,
							states: changedStates,
						},
						isChangedState,
					};
				}
			)
			// $FlowFixMe
			.filter((item: null | StateGraph) => null !== item)
	);
};
