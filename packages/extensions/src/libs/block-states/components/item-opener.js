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
import type { StateTypes } from '../types';

const ItemOpener = ({
	item,
	itemId,
}: {
	item: StateTypes,
	itemId: number,
}): boolean | MixedElement => {
	if ('normal' === item.type && 0 === itemId) {
		return false;
	}

	return <Icon library={'publisher'} icon={'publisherSettings'} />;
};

ItemOpener.hasButton = (item: StateTypes, itemId: number): boolean =>
	'normal' !== item.type || 0 !== itemId;

export default ItemOpener;
