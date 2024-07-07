// @flow

/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { prepare } from '@blockera/data-editor';

/**
 * Internal dependencies
 */
import type { CalculateCurrentAttributesProps } from './types';
import {
	isInnerBlock,
	prepareAttributesDefaultValues,
} from '../../extensions/components/utils';
import { isNormalStateOnBaseBreakpoint } from '../../extensions/libs/block-states/helpers';
import { getBaseBreakpoint } from '../../canvas-editor';

export const useCalculateCurrentAttributes = ({
	attributes,
	blockAttributes,
	currentInnerBlock,
	blockeraInnerBlocks,
}: CalculateCurrentAttributesProps): Object => {
	let currentAttributes: Object = {};
	const { currentBlock, currentState, currentBreakpoint } = useSelect(
		(select) => {
			const {
				getExtensionCurrentBlock = () => 'master',
				getExtensionInnerBlockState = () => 'normal',
				getExtensionCurrentBlockState = () => 'normal',
				getExtensionCurrentBlockStateBreakpoint = () =>
					getBaseBreakpoint(),
			} = select('blockera/extensions') || {};

			return {
				currentBlock: getExtensionCurrentBlock(),
				currentState: getExtensionCurrentBlockState(),
				currentInnerBlockState: getExtensionInnerBlockState(),
				currentBreakpoint: getExtensionCurrentBlockStateBreakpoint(),
			};
		}
	);
	const blockAttributesDefaults =
		prepareAttributesDefaultValues(blockAttributes);

	// Assume block is inner block type.
	if (isInnerBlock(currentBlock)) {
		currentAttributes = {
			...blockAttributesDefaults,
			...currentInnerBlock,
		};
	}
	// Assume master block in normal state.
	else if (isNormalStateOnBaseBreakpoint(currentState, currentBreakpoint)) {
		currentAttributes = {
			...blockAttributesDefaults,
			...attributes,
		};
	}
	// Assume master block is not in normal state and base breakpoint.
	else if (!isNormalStateOnBaseBreakpoint(currentState, currentBreakpoint)) {
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
