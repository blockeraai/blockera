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

export const Preformatted = {
	name: 'blockeraPreformatted',
	targetBlock: 'core/preformatted',
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
