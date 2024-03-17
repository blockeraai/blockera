// @flow

/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import type { CalculateCurrentAttributesProps } from './types';
import { isInnerBlock, isNormalState } from '../../components/utils';

export const useCalculateCurrentAttributes = ({
	attributes,
	currentInnerBlock,
	publisherInnerBlocks,
}: CalculateCurrentAttributesProps): Object => {
	let currentAttributes: Object = {};
	let {
		currentBlock,
		currentState,
		currentBreakpoint,
		currentInnerBlockState,
	} = useSelect((select) => {
		const {
			getExtensionCurrentBlock = () => 'master',
			getExtensionInnerBlockState = () => 'normal',
			getExtensionCurrentBlockState = () => 'normal',
			getExtensionCurrentBlockStateBreakpoint = () => 'laptop',
		} = select('publisher-core/extensions') || {};

		return {
			currentBlock: getExtensionCurrentBlock(),
			currentState: getExtensionCurrentBlockState(),
			currentInnerBlockState: getExtensionInnerBlockState(),
			currentBreakpoint: getExtensionCurrentBlockStateBreakpoint(),
		};
	});

	if (isNormalState(currentState) && 'laptop' === currentBreakpoint) {
		if (isInnerBlock(currentBlock)) {
			currentAttributes = {
				...attributes,
				...currentInnerBlock?.attributes,
				...((
					((
						(currentInnerBlock?.attributes?.publisherBlockStates ||
							{})[currentInnerBlockState] || {}
					)?.breakpoints || {})?.[currentBreakpoint] || {}
				)?.attributes || {}),
			};
		} else {
			currentAttributes = attributes;
		}
	} else if (isInnerBlock(currentBlock)) {
		if (publisherInnerBlocks[currentBlock] && !currentInnerBlock) {
			currentInnerBlock = publisherInnerBlocks[currentBlock];
		}
		if (
			!currentInnerBlock?.attributes?.publisherBlockStates ||
			!currentInnerBlock?.attributes?.publisherBlockStates[
				currentInnerBlockState
			]
		) {
			currentAttributes = currentInnerBlock?.attributes;
		} else {
			currentAttributes = {
				...currentInnerBlock?.attributes,
				...(currentInnerBlock?.attributes?.publisherBlockStates[
					currentInnerBlockState
				]?.breakpoints[currentBreakpoint]
					? currentInnerBlock?.attributes?.publisherBlockStates[
							currentInnerBlockState
					  ]?.breakpoints[currentBreakpoint]?.attributes
					: {}),
			};
		}
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
			...((publisherInnerBlocks[currentBlock] || {})?.attributes || {}),
			...currentAttributes,
		};
	}

	return currentAttributes;
};
