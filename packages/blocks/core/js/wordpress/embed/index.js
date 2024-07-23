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

export const Embed = {
	name: 'blockeraEmbed',
	targetBlock: 'core/embed',
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
