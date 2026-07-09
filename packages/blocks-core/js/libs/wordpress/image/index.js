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
import type { BlockType } from '../../type';
import sharedInnerBlocks from '../inners/shared';

const imageSelector =
	'.wp-block-image img,.wp-block-image svg,.wp-block-image .wp-block-image__crop-area,.wp-block-image .components-placeholder,.wp-block-image .block-editor-media-placeholder::before,.wp-block-image .components-resizable-box__container::before';

export const Image: BlockType = {
	name: 'blockeraImage',
	targetBlock: 'core/image',
	blockeraInnerBlocks: {
		'elements/caption': {
			name: 'elements/caption',
			label: __('Caption', 'blockera'),
			description: __(
				'The image caption element inside image block.',
				'blockera'
			),
			icon: <Icon icon="block-image-caption" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/link': {
			...sharedInnerBlocks['elements/link'],
			label: __('Link', 'blockera'),
			description: __('Hyperlink element.', 'blockera'),
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
	blockFeatures: {
		icon: {
			status: true,
			context: ['blockera/icon'],
		},
	},
	selectors: {
		blockeraWidth: {
			root: imageSelector,
		},
		blockeraMinWidth: {
			root: imageSelector,
		},
		blockeraMaxWidth: {
			root: imageSelector,
		},
		blockeraHeight: {
			root: imageSelector,
		},
		blockeraMinHeight: {
			root: imageSelector,
		},
		blockeraMaxHeight: {
			root: imageSelector,
		},
		blockeraRatio: {
			root: imageSelector,
		},
	},
};
