// @flow

/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Publisher dependencies
 */
import { prepare } from '@publisher/data-extractor';

/**
 * Internal dependencies
 */
import type { CalculateCurrentAttributesProps } from './types';
import {
	isInnerBlock,
	isNormalState,
	prepareAttributesDefaultValues,
} from '../../components/utils';

export const useCalculateCurrentAttributes = ({
	attributes,
	blockAttributes,
	currentInnerBlock,
	publisherInnerBlocks,
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
		} = select('publisher-core/extensions') || {};

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
					...((publisherInnerBlocks[currentBlock] || {})
						?.attributes || {}),
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
					...((publisherInnerBlocks[currentBlock] || {})
						?.attributes || {}),
					publisherBlockStates:
						currentInnerBlock?.attributes?.publisherBlockStates,
					...currentInnerBlock?.attributes?.publisherBlockStates[
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
					...((publisherInnerBlocks[currentBlock] || {})
						?.attributes || {}),
					...(prepare(
						`publisherBlockStates[${currentState}].breakpoints[${currentBreakpoint}].attributes.publisherInnerBlocks[${currentBlock}].attributes`,
						attributes
					) || {}),
				};
			}
			// Assume inner block and master block in pseudo-class.
			else if (
				!isNormalState(currentInnerBlockState) ||
				'laptop' !== currentBreakpoint
			) {
				currentAttributes = {
					...blockAttributesDefaults,
					...((publisherInnerBlocks[currentBlock] || {})
						?.attributes || {}),
					...(prepare(
						`publisherBlockStates[${currentState}].breakpoints[${currentBreakpoint}].attributes.publisherInnerBlocks[${currentBlock}].attributes.publisherBlockStates[${currentInnerBlockState}].breakpoints[${currentBreakpoint}].attributes`,
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
			publisherBlockStates: attributes?.publisherBlockStates,
			...(prepare(
				`publisherBlockStates[${currentState}].breakpoints[${currentBreakpoint}].attributes`,
				attributes
			) || {}),
		};
	}

	if (!Object(currentAttributes?.publisherInnerBlocks).length) {
		currentAttributes.publisherInnerBlocks = { ...publisherInnerBlocks };
	}

	return currentAttributes;
};
