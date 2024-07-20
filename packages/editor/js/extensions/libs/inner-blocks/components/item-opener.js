// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';

const ItemOpener = (): boolean | MixedElement => {
	return <Icon library={'blockera'} icon={'blockeraSettings'} />;
};

ItemOpener.hasButton = (): boolean => true;

export default ItemOpener;
