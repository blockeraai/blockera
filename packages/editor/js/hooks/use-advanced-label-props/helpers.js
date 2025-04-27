// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { hasInvolvesSomeItems } from '@blockera/utils';

export const blockHasStates = (attributes: Object): boolean => {
	const { getStates } = select('blockera/editor');
	const statesDefinition = getStates();
	const stateTypes = Object.keys(statesDefinition);

	return hasInvolvesSomeItems(
		attributes?.blockeraBlockStates || {},
		stateTypes
	);
};
