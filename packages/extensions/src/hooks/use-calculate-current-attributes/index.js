// @flow

/**
 * Internal dependencies
 */
import { isInnerBlock } from '../../components';
import type { CalculateCurrentAttributesProps } from './types';
import type { InnerBlockModel } from '../../libs/inner-blocks/types';

export const useCalculateCurrentAttributes = ({
	attributes,
	currentBlock,
	breakpointId,
	blockStateId,
	isNormalState,
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
		currentAttributes = {
			...currentInnerBlock?.attributes,
			...(currentInnerBlock?.attributes?.publisherBlockStates[
				blockStateId
			]?.breakpoints[breakpointId]
				? currentInnerBlock?.attributes?.publisherBlockStates[
						blockStateId
				  ]?.breakpoints[breakpointId]?.attributes
				: {}),
		};
	} else {
		currentAttributes = {
			...attributes,
			...(attributes.publisherBlockStates[blockStateId].breakpoints[
				breakpointId
			]
				? attributes.publisherBlockStates[blockStateId].breakpoints[
						breakpointId
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
			...currentAttributes,
			...((
				publisherInnerBlocks.find(
					(innerBlock: InnerBlockModel): boolean =>
						innerBlock.type === currentBlock
				) || {}
			)?.attributes || {}),
		};
	}

	return currentAttributes;
};
