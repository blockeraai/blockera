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

export const Separator = {
	name: 'blockeraSeparator',
	targetBlock: 'core/separator',
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
