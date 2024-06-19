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

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

export const Preformatted = {
	name: 'blockeraPreformatted',
	targetBlock: 'core/preformatted',
	attributes,
	supports,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
