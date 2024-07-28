// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import button from '../inners/button';

export const Buttons = {
	name: 'blockeraButtons',
	targetBlock: 'core/buttons',
	blockeraInnerBlocks: button,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
