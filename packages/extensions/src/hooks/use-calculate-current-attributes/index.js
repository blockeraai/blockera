// @flow

/**
 * Internal dependencies
 */
import { isInnerBlock } from '../../components';
import type { CalculateCurrentAttributesProps } from './types';

export const useCalculateCurrentAttributes = ({
	attributes,
	currentBlock,
	currentState,
	isNormalState,
	currentBreakpoint,
	currentInnerBlock,
	publisherInnerBlocks,
}: CalculateCurrentAttributesProps): Object => {
	let currentAttributes: Object = {};

	if (isNormalState()) {
		if (isInnerBlock(currentBlock)) {
			currentAttributes = currentInnerBlock?.attributes;
		} else {
			currentAttributes = attributes;
		}
	} else if (isInnerBlock(currentBlock)) {
		if (publisherInnerBlocks[currentBlock]) {
			currentInnerBlock = publisherInnerBlocks[currentBlock];
		}
		if (
			!currentInnerBlock?.attributes?.publisherBlockStates[currentState]
		) {
			currentState = 'normal';
		}

		currentAttributes = {
			...currentInnerBlock?.attributes,
			...(currentInnerBlock?.attributes?.publisherBlockStates[
				currentState
			]?.breakpoints[currentBreakpoint]
				? currentInnerBlock?.attributes?.publisherBlockStates[
						currentState
				  ]?.breakpoints[currentBreakpoint]?.attributes
				: {}),
		};
	} else {
		if (!attributes.publisherBlockStates[currentState]) {
			currentState = 'normal';
		}

		currentAttributes = {
			...attributes,
			...(attributes.publisherBlockStates[currentState].breakpoints[
				currentBreakpoint
			]
				? attributes.publisherBlockStates[currentState].breakpoints[
						currentBreakpoint
				  ].attributes
				: {}),
		};
	}

	// default inner blocks when yet still not updated on block main attributes state.
	if (!isInnerBlock(currentBlock)) {
		currentAttributes = {
			...currentAttributes,
			publisherInnerBlocks,
		};
	} else {
		currentAttributes = {
			...attributes,
			...currentAttributes,
			...((publisherInnerBlocks[currentBlock] || {})?.attributes || {}),
		};
	}

	return currentAttributes;
};
