// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../type';

export const Gallery: BlockType = {
	name: 'blockeraGallery',
	targetBlock: 'core/gallery',
	blockeraInnerBlocks: {
		'core/image': {
			...sharedInnerBlocks['core/image'],
			settings: {
				...sharedInnerBlocks['core/image'].settings,
				force: true,
			},
		},
		'elements/image-caption': {
			name: 'elements/image-caption',
			label: __('Images Captions', 'blockera'),
			description: __(
				'The caption of the images inside the gallery.',
				'blockera'
			),
			icon: <Icon icon="block-image-caption" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/gallery-caption': {
			name: 'elements/gallery-caption',
			label: __('Gallery Caption', 'blockera'),
			description: __('The caption of the gallery.', 'blockera'),
			icon: <Icon icon="block-gallery-caption" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
