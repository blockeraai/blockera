// @flow

/**
 * Blockera dependencies
 */
import { hasInvolvesSomeItems } from '@blockera/utils';

/**
 * Internal dependencies
 */
import staticStates from '@blockera/extensions/src/libs/block-states/states';

export const blockHasStates = (attributes: Object): boolean => {
	const stateTypes = Object.keys(staticStates);

	return hasInvolvesSomeItems(
		attributes?.blockeraBlockStates || {},
		stateTypes
	);
};
