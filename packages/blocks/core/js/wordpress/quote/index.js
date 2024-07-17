// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	SharedBlockExtension,
	sharedBlockExtensionSupports,
	sharedBlockExtensionAttributes,
} from '@blockera/editor';

/**
 * Internal dependencies
 */
import link from '../inners/link';
import citation from '../inners/citation';
import headings from '../inners/headings';
import paragraph from '../inners/paragraph';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

export const Quote = {
	name: 'blockeraQuote',
	targetBlock: 'core/quote',
	attributes,
	supports,
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
