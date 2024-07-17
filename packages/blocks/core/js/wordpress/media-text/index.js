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

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

export const MediaText = {
	name: 'blockeraMediaText',
	targetBlock: 'core/media-text',
	attributes,
	supports,
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
