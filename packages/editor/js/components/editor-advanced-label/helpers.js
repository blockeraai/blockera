// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import {
	isNull,
	isEmpty,
	isEquals,
	isObject,
	isUndefined,
	mergeObject,
} from '@blockera/utils';
import { prepare } from '@blockera/data-editor';

/**
 * Internal dependencies
 */
import {
	type StateGraph,
	getStatesGraphNodes,
	type StateGraphItem,
} from './selector';
import { getBaseBreakpoint } from '../../canvas-editor';
import { isInnerBlock, useBlockContext } from '../../extensions';
import type { LabelStates, LabelChangedStates } from './types';

export const getStatesGraph = ({
	controlId,
	blockName,
	defaultValue,
	path,
	isRepeaterItem,
}: {
	controlId: string,
	blockName: string,
	defaultValue: any,
	path: null | string,
	isRepeaterItem: Boolean,
}): Array<LabelStates> => {
	const blockStates = controlId ? getStatesGraphNodes() : [];

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { getAttributes = () => {}, currentBlock } = useBlockContext();

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
									isInnerBlock(currentBlock) &&
									state?.attributes?.blockeraInnerBlocks
								) {
									state = mergeObject(
										state,
										state.attributes.blockeraInnerBlocks[
											currentBlock
										]
									);
								}

								if (
									!state.attributes.hasOwnProperty(controlId)
								) {
									return null;
								}

								let value;

								if (path) {
									value =
										prepare(path, state.attributes) ??
										prepare(
											path,
											state.attributes[controlId]
										);
								} else {
									value = state.attributes[controlId];
								}

								if (isUndefined(value) && isRepeaterItem) {
									return null;
								}

								if (isUndefined(defaultValue)) {
									defaultValue =
										getBlockType(blockName)?.attributes[
											controlId
										]?.default;
								}

								if (isObject(defaultValue)) {
									if (path && path.includes('blockera')) {
										const preparedPath = path.substring(
											path.indexOf('.') + 1
										);

										defaultValue =
											prepare(
												preparedPath,
												defaultValue
											) ?? defaultValue;
									} else {
										defaultValue =
											prepare(path, defaultValue) ??
											defaultValue;
									}
								}

								const attributes = getAttributes();

								const rootValue =
									prepare(path, attributes) ??
									prepare(path, attributes[controlId]);

								if (
									(state.type !== 'normal' ||
										stateGraph.type !==
											getBaseBreakpoint()) &&
									isEquals(value, rootValue)
								) {
									return null;
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
