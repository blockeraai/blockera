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
import link from '../inners/link';
import button from '../inners/button';
import headings from '../inners/headings';
import paragraph from '../inners/paragraph';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../inners/shared';

export const Group = {
	name: 'blockeraGroup',
	targetBlock: 'core/group',
	blockeraInnerBlocks: {
		'core/heading': sharedInnerBlocks['core/heading'],
		'core/paragraph': sharedInnerBlocks['core/paragraph'],
		'elements/link': sharedInnerBlocks['elements/link'],
		'core/button': sharedInnerBlocks['core/button'],
		'core/heading-1': sharedInnerBlocks['core/heading-1'],
		'core/heading-2': sharedInnerBlocks['core/heading-2'],
		'core/heading-3': sharedInnerBlocks['core/heading-3'],
		'core/heading-4': sharedInnerBlocks['core/heading-4'],
		'core/heading-5': sharedInnerBlocks['core/heading-5'],
		'core/heading-6': sharedInnerBlocks['core/heading-6'],
	},
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
