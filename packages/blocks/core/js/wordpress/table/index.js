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

export const Table = {
	name: 'blockeraTable',
	targetBlock: 'core/table',
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
