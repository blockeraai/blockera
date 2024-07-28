// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import link from '../inners/link';
import paragraph from '../inners/paragraph';

export const Details = {
	name: 'blockeraDetails',
	targetBlock: 'core/details',
	blockeraInnerBlocks: {
		...paragraph,
		...link,
	},
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
