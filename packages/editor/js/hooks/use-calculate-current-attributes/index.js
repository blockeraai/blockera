// @flow

/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';
import { prepare } from '@blockera/data-editor';

/**
 * Internal dependencies
 */
import type { CalculateCurrentAttributesProps } from './types';
import {
	isInnerBlock,
	isNormalState,
	prepareAttributesDefaultValues,
} from '../../extensions/components/utils';

export const useCalculateCurrentAttributes = ({
	attributes,
	blockAttributes,
	currentInnerBlock,
	blockeraInnerBlocks,
}: CalculateCurrentAttributesProps): Object => {
	let currentAttributes: Object = {};
	const {
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
		} = select('blockera/extensions') || {};

		return {
			currentBlock: getExtensionCurrentBlock(),
			currentState: getExtensionCurrentBlockState(),
			currentInnerBlockState: getExtensionInnerBlockState(),
			currentBreakpoint: getExtensionCurrentBlockStateBreakpoint(),
		};
	});
	const blockAttributesDefaults =
		prepareAttributesDefaultValues(blockAttributes);

	// Assume block is inner block type.
	if (isInnerBlock(currentBlock)) {
		// Assume master block in normal state.
		if (isNormalState(currentState) && 'laptop' === currentBreakpoint) {
			// Assume inner block in normal state.
			if (
				isNormalState(currentInnerBlockState) &&
				'laptop' === currentBreakpoint
			) {
				currentAttributes = {
					...blockAttributesDefaults,
					...((blockeraInnerBlocks[currentBlock] || {})?.attributes ||
						{}),
					...currentInnerBlock?.attributes,
				};
			}
			// Assume inner block is not in normal state.
			else if (
				!isNormalState(currentInnerBlockState) ||
				'laptop' !== currentBreakpoint
			) {
				currentAttributes = {
					...blockAttributesDefaults,
					...((blockeraInnerBlocks[currentBlock] || {})?.attributes ||
						{}),
					...currentInnerBlock?.attributes,
					...currentInnerBlock?.attributes?.blockeraBlockStates[
						currentInnerBlockState
					]?.breakpoints[currentBreakpoint]?.attributes,
				};
			}
		}
		// Assume master block is not in normal state.
		else if (
			!isNormalState(currentState) ||
			'laptop' !== currentBreakpoint
		) {
			// Assume inner block in normal state inside master block in pseudo-class.
			if (
				isNormalState(currentInnerBlockState) &&
				'laptop' === currentBreakpoint
			) {
				currentAttributes = {
					...blockAttributesDefaults,
					...((blockeraInnerBlocks[currentBlock] || {})?.attributes ||
						{}),
					...mergeObject(
						currentInnerBlock?.attributes,
						prepare(
							`blockeraBlockStates[${currentState}].breakpoints[${currentBreakpoint}].attributes.blockeraInnerBlocks[${currentBlock}].attributes`,
							attributes
						) || {}
					),
				};
			}
			// Assume inner block and master block in pseudo-class.
			else if (
				!isNormalState(currentInnerBlockState) ||
				'laptop' !== currentBreakpoint
			) {
				currentAttributes = {
					...blockAttributesDefaults,
					...((blockeraInnerBlocks[currentBlock] || {})?.attributes ||
						{}),
					...currentInnerBlock?.attributes,
					...(prepare(
						`blockeraBlockStates[${currentState}].breakpoints[${currentBreakpoint}].attributes.blockeraInnerBlocks[${currentBlock}].attributes.blockeraBlockStates[${currentInnerBlockState}].breakpoints[${currentBreakpoint}].attributes`,
						attributes
					) || {}),
				};
			}
		}
	}
	// Assume master block in normal state.
	else if (isNormalState(currentState) && 'laptop' === currentBreakpoint) {
		currentAttributes = {
			...blockAttributesDefaults,
			...attributes,
		};
	}
	// Assume master block is not in normal state and laptop breakpoint.
	else if (!isNormalState(currentState) || 'laptop' !== currentBreakpoint) {
		currentAttributes = {
			...blockAttributesDefaults,
			...attributes,
			...(prepare(
				`blockeraBlockStates[${currentState}].breakpoints[${currentBreakpoint}].attributes`,
				attributes
			) || {}),
		};
	}

	if (!Object(currentAttributes?.blockeraInnerBlocks).length) {
		currentAttributes.blockeraInnerBlocks = { ...blockeraInnerBlocks };
	}

	return currentAttributes;
};
