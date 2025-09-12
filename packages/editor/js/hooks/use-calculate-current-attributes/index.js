// @flow

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
import { useExtensionsStore } from '../use-extensions-store';
import { isNormalStateOnBaseBreakpoint } from '../../extensions/libs/block-card/block-states/helpers';

export const useCalculateCurrentAttributes = ({
	name,
	clientId,
	attributes,
	blockAttributes,
	currentInnerBlock,
	blockeraInnerBlocks,
}: CalculateCurrentAttributesProps): Object => {
	let currentAttributes: Object = {};
	const { currentBlock, currentState, currentBreakpoint } =
		useExtensionsStore({ name, clientId });
	const blockAttributesDefaults =
		prepareBlockeraDefaultAttributesValues(blockAttributes);

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
