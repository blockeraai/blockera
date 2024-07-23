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

export const Video = {
	name: 'blockeraVideo',
	targetBlock: 'core/video',
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
