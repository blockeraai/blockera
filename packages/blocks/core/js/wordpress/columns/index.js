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
import button from '../inners/button';
import headings from '../inners/headings';
import paragraph from '../inners/paragraph';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

export const Columns = {
	name: 'blockeraColumns',
	targetBlock: 'core/columns',
	attributes,
	supports,
	blockeraInnerBlocks: {
		...link,
		...paragraph,
		...button,
		...headings,
	},
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
