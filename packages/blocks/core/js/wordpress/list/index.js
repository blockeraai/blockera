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

/**
 * Internal dependencies
 */
import link from '../inners/link';

export const List = {
	name: 'blockeraList',
	targetBlock: 'core/list',
	blockeraInnerBlocks: link,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
