// @flow

/**
 * Publisher dependencies
 */
import { hasInvolvesSomeItems } from '@publisher/utils';

/**
 * Internal dependencies
 */
import staticStates from '@publisher/extensions/src/libs/block-states/states';

export const blockHasStates = (attributes: Object): boolean => {
	const stateTypes = Object.keys(staticStates);

	return hasInvolvesSomeItems(
		attributes?.publisherBlockStates || {},
		stateTypes
	);
};
