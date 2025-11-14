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
import type { BlockType } from '../../../type';

export const Embed: BlockType = {
	name: 'blockeraEmbed',
	targetBlock: 'core/embed',
	blockeraInnerBlocks: {
		'elements/caption': {
			name: 'elements/caption',
			label: __('Caption', 'blockera'),
			description: __(
				'The embed caption element inside embed block.',
				'blockera'
			),
			icon: <Icon icon="block-video-caption" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
