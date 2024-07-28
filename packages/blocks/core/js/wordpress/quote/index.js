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
import citation from '../inners/citation';
import headings from '../inners/headings';
import paragraph from '../inners/paragraph';

export const Quote = {
	name: 'blockeraQuote',
	targetBlock: 'core/quote',
	blockeraInnerBlocks: {
		...citation,
		...paragraph,
		...link,
		...headings,
	},
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
