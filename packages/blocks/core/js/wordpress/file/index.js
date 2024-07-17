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

/**
 * Internal dependencies
 */
import link from '../inners/link';
import button from '../inners/button';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

export const File = {
	name: 'blockeraFile',
	targetBlock: 'core/file',
	attributes,
	supports,
	blockeraInnerBlocks: {
		...link,
		...button,
	},
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
