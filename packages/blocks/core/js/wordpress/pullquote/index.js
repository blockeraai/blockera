// @flow

/**
 * External dependencies
 */
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
import paragraph from '../inners/paragraph';

export const Pullquote = {
	name: 'blockeraPullquote',
	targetBlock: 'core/pullquote',
	blockeraInnerBlocks: {
		...citation,
		...paragraph,
		...link,
	},
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
