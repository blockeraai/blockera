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
import image from '../inners/image';
import headings from '../inners/headings';
import paragraph from '../inners/paragraph';

export const MediaText = {
	name: 'blockeraMediaText',
	targetBlock: 'core/media-text',
	blockeraInnerBlocks: {
		...paragraph,
		...image,
		...link,
		...headings,
	},
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
