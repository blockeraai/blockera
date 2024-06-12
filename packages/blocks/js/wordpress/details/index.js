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
	InnerBlockParagraphIcon,
	InnerBlockLinkIcon,
} from '@blockera/editor/js/extensions/libs';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

const blockeraInnerBlocks: InnerBlocks = {
	paragraph: {
		name: 'core/paragraph',
		type: 'paragraph',
		label: __('Paragraphs', 'blockera'),
		icon: <InnerBlockParagraphIcon />,
		selectors: {
			root: 'p',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	link: {
		name: 'core/link',
		type: 'link',
		label: __('Links', 'blockera'),
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

export const Details = {
	name: 'blockeraDetails',
	targetBlock: 'core/details',
	attributes,
	supports,
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
