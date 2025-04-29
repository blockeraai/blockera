// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { StateTypes, TStates } from '../types';

const ItemOpener = ({
	item,
}: {
	item: StateTypes,
	itemId: TStates,
}): boolean | MixedElement => {
	if (item?.force) {
		return false;
	}

	return <Icon library={'ui'} icon={'gear'} iconSize={18} />;
};

ItemOpener.hasButton = (item: StateTypes): boolean => !item?.force;

export default ItemOpener;
