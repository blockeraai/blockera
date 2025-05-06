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
			settings: {
				...sharedInnerBlocks['elements/link'].settings,
				force: false,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
