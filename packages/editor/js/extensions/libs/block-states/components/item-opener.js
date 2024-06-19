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
	itemId,
}: {
	item: StateTypes,
	itemId: TStates,
}): boolean | MixedElement => {
	if ('normal' === itemId) {
		return false;
	}

	return <Icon library={'blockera'} icon={'blockeraSettings'} />;
};

ItemOpener.hasButton = (item: StateTypes, itemId: TStates): boolean =>
	'normal' !== itemId;

export default ItemOpener;
