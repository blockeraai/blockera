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

export const PostFeaturedImage = {
	name: 'blockeraPostFeaturedImage',
	targetBlock: 'core/post-featured-image',
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
