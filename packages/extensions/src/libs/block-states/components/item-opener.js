// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { Icon } from '@publisher/components';

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

	return <Icon library={'publisher'} icon={'publisherSettings'} />;
};

ItemOpener.hasButton = (item: StateTypes, itemId: TStates): boolean =>
	'normal' !== itemId;

export default ItemOpener;
