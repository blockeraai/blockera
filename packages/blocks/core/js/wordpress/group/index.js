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
import button from '../inners/button';
import headings from '../inners/headings';
import paragraph from '../inners/paragraph';

export const Group = {
	name: 'blockeraGroup',
	targetBlock: 'core/group',
	blockeraInnerBlocks: {
		...paragraph,
		...link,
		...button,
		...headings,
	},
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
