// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	SharedBlockExtension,
	sharedBlockExtensionSupports,
	sharedBlockExtensionAttributes,
} from '@blockera/editor';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import link from '../inners/link';
import headings from '../inners/headings';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

export const Comments = {
	name: 'blockeraComments',
	targetBlock: 'core/comments',
	attributes,
	supports,
	blockeraInnerBlocks: {
		...link,
		...headings,
	},
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
