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
	InnerBlockImageIcon,
} from '@blockera/editor-extensions/js/libs';
import type { InnerBlocks } from '@blockera/editor-extensions/js/libs/inner-blocks/types';

/**
 * Internal dependencies
 */
import { InnerBlockImageCaptionIcon } from './icons/inner-block-image-caption';
import { InnerBlockGalleryCaptionIcon } from './icons/inner-block-gallery-caption';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

const blockeraInnerBlocks: InnerBlocks = {
	gallery_caption: {
		name: 'core/gallery_caption',
		type: 'image',
		label: __('Gallery Caption', 'blockera'),
		icon: <InnerBlockGalleryCaptionIcon />,
		selectors: {
			root: '> figcaption',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	image: {
		name: 'core/image',
		type: 'image',
		label: __('Images', 'blockera'),
		icon: <InnerBlockImageIcon />,
		selectors: {
			root: '.wp-block-image img',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	image_caption: {
		name: 'core/image_caption',
		type: 'image',
		label: __('Images Captions', 'blockera'),
		icon: <InnerBlockImageCaptionIcon />,
		selectors: {
			root: '.wp-block-image figcaption',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
};

export const Gallery = {
	name: 'blockeraGallery',
	targetBlock: 'core/gallery',
	attributes,
	supports,
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
