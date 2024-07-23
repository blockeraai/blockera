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

export const Button = {
	name: 'blockeraButton',
	targetBlock: 'core/button',
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
