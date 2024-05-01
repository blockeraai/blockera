// @flow

/**
 * Blockera dependencies
 */
import { hasInvolvesSomeItems } from '@blockera/utils';

/**
 * Internal dependencies
 */
import staticStates from '@blockera/editor-extensions/js/libs/block-states/states';

export const blockHasStates = (attributes: Object): boolean => {
	const stateTypes = Object.keys(staticStates);

	return hasInvolvesSomeItems(
		attributes?.blockeraBlockStates || {},
		stateTypes
	);
};
