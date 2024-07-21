// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';
import {
	SharedBlockExtension,
	sharedBlockExtensionSupports,
	sharedBlockExtensionAttributes,
} from '@blockera/editor';

/**
 * Internal dependencies
 */
import link from '../inners/link';
import button from '../inners/button';
import headings from '../inners/headings';
import paragraph from '../inners/paragraph';

const attributes: Object = mergeObject(sharedBlockExtensionAttributes, {
	blockeraDisplay: {
		default: 'flex',
	},
});

const supports = sharedBlockExtensionSupports;

export const Group = {
	name: 'blockeraGroup',
	targetBlock: 'core/group',
	attributes,
	supports,
	blockeraInnerBlocks: {
		...paragraph,
		...link,
		...button,
		...headings,
	},
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
