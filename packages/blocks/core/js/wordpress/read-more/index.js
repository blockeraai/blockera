// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

export const ReadMore = {
	name: 'blockeraReadMore',
	targetBlock: 'core/read-more',
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
