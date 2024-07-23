// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

export const ListItem = {
	name: 'blockeraListItem',
	targetBlock: 'core/list-item',
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
