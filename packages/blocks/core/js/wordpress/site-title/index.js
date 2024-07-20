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

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

export const SiteTitle = {
	name: 'blockeraSiteTitle',
	targetBlock: 'core/site-title',
	attributes,
	supports,
	blockeraInnerBlocks: link,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
