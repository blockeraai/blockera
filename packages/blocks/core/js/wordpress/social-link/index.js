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

export const SocialLink: BlockType = {
	name: 'blockeraSocialLink',
	targetBlock: 'core/social-link',
	blockeraInnerBlocks: {
		'elements/item-icon': {
			name: 'elements/item-icon',
			label: __('Social Link Icon', 'blockera'),
			description: __(
				'The social link button icon elements.',
				'blockera'
			),
			icon: <Icon icon="block-social-link-icon" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/item-name': {
			name: 'elements/item-name',
			label: __('Social Link Name', 'blockera'),
			description: __(
				'The social link button name elements.',
				'blockera'
			),
			icon: <Icon icon="block-social-link-name" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
