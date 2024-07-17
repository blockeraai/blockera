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

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

export const PostNavigationLink = {
	name: 'blockeraPostNavigationLink',
	targetBlock: 'core/post-navigation-link',
	attributes,
	attributes,
	supports,
	blockeraInnerBlocks: link,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
