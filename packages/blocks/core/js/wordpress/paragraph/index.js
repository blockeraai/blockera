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
import sharedInnerBlocks from '../inners/shared';

export const Paragraph = {
	name: 'blockeraParagraph',
	targetBlock: 'core/paragraph',
	blockeraInnerBlocks: {
		'elements/link': sharedInnerBlocks['elements/link'],
	},
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
