// @flow

/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element';

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
	prepareBlockeraDefaultAttributesValues,
} from '../../extensions/components/utils';
import { isNormalStateOnBaseBreakpoint } from '../../extensions/libs/block-card/block-states/helpers';

export const useCalculateCurrentAttributes = ({
	attributes,
	currentBlock,
	currentState,
	blockAttributes,
	currentBreakpoint,
	currentInnerBlock,
	blockeraInnerBlocks,
}: CalculateCurrentAttributesProps): Object => {
	return useMemo(() => {
		let currentAttributes: Object = {};

		const blockAttributesDefaults =
			prepareBlockeraDefaultAttributesValues(blockAttributes);

		// Assume block is inner block type.
		if (isInnerBlock(currentBlock)) {
			const {
				settings: { hasContent },
			} = blockeraInnerBlocks[currentBlock] || {
				settings: { hasContent: false },
			};
			currentAttributes = {
				...blockAttributesDefaults,
				...(!hasContent
					? currentInnerBlock
					: {
							blockeraInnerBlocks:
								attributes.blockeraInnerBlocks || {},
					  }),
				...currentInnerBlock,
			};
		}
		// Assume master block in normal state.
		else if (
			isNormalStateOnBaseBreakpoint(currentState, currentBreakpoint)
		) {
			currentAttributes = {
				...blockAttributesDefaults,
				...attributes,
			};
		}
		// Assume master block is not in normal state and base breakpoint.
		else if (
			!isNormalStateOnBaseBreakpoint(currentState, currentBreakpoint)
		) {
			currentAttributes = {
				...blockAttributesDefaults,
				...(prepare(
					`blockeraBlockStates[${currentState}].breakpoints[${currentBreakpoint}].attributes`,
					attributes
				) || {}),
			};
		}

		if (!Object.values(currentAttributes?.blockeraInnerBlocks).length) {
			currentAttributes.blockeraInnerBlocks = { ...blockeraInnerBlocks };
		}

		return currentAttributes;
	}, [
		attributes,
		currentBlock,
		currentState,
		blockAttributes,
		currentBreakpoint,
		currentInnerBlock,
		blockeraInnerBlocks,
	]);
};
