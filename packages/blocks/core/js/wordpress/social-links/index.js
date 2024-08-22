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

export const SocialLinks: BlockType = {
	name: 'blockeraSocialLinks',
	targetBlock: 'core/social-links',
	blockeraInnerBlocks: {
		'elements/item-containers': {
			name: 'elements/item-containers',
			label: __('Social Links', 'blockera'),
			description: __('The social link elements.', 'blockera'),
			icon: <Icon icon="block-social-link-container" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/item-icons': {
			name: 'elements/item-icons',
			label: __('Social Link Icons', 'blockera'),
			description: __('The social link icon elements.', 'blockera'),
			icon: <Icon icon="block-social-link-icon" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/item-names': {
			name: 'elements/item-names',
			label: __('Social Link Names', 'blockera'),
			description: __('The social link name elements.', 'blockera'),
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
