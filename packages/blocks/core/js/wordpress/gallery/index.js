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
import image from '../inners/image';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

const blockeraInnerBlocks: InnerBlocks = {
	gallery_caption: {
		name: 'elements/gallery-caption',
		label: __('Gallery Caption', 'blockera'),
		icon: <Icon icon="block-gallery-caption" iconSize="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
	image_caption: {
		name: 'elements/image-caption',
		label: __('Images Captions', 'blockera'),
		icon: <Icon icon="block-image-caption" iconSize="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
};

export const Gallery = {
	name: 'blockeraGallery',
	targetBlock: 'core/gallery',
	attributes,
	supports,
	blockeraInnerBlocks: {
		...blockeraInnerBlocks,
		...image,
	},
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
