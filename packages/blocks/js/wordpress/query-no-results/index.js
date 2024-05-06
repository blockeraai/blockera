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
	InnerBlockLinkIcon,
} from '@blockera/editor-extensions/js/libs';
import type { InnerBlocks } from '@blockera/editor-extensions/js/libs/inner-blocks/types';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

const blockeraInnerBlocks: InnerBlocks = {
	link: {
		name: 'core/link',
		type: 'link',
		label: __('Link', 'blockera'),
		icon: <InnerBlockLinkIcon />,
		selectors: {
			root: 'a:not(.wp-element-button)',
		},
		attributes,
		innerBlockSettings: {
			force: true,
			dataCompatibility: ['font-color', 'font-color-hover'],
		},
	},
};

export const QueryNoResults = {
	name: 'blockeraQueryNoResults',
	targetBlock: 'core/query-no-results',
	attributes,
	supports,
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
