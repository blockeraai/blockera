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

export const Code = {
	name: 'blockeraCode',
	targetBlock: 'core/code',
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
