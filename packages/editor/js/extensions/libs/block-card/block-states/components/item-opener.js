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
import { isDefaultState } from '../helpers';
import type { StateTypes, TStates } from '../types';

const ItemOpener = ({
	itemId,
}: {
	item: StateTypes,
	itemId: TStates,
}): boolean | MixedElement => {
	if (isDefaultState(itemId)) {
		return false;
	}

	return <Icon library={'ui'} icon={'gear'} iconSize={18} />;
};

ItemOpener.hasButton = (item: StateTypes, itemId: TStates): boolean =>
	!isDefaultState(itemId);

export default ItemOpener;
