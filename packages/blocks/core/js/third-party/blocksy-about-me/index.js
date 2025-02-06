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

export const BlocksyAboutMe: BlockType = {
	name: 'blockeraBlocksyAboutMe',
	targetBlock: 'blocksy/about-me',
	blockeraInnerBlocks: {
		'elements/avatar': {
			name: 'elements/avatar',
			label: __('Avatar', 'blockera'),
			description: __(
				'The avatar image inside the about me block.',
				'blockera'
			),
			icon: <Icon icon="block-blocksy-about-avatar" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/name': {
			name: 'elements/name',
			label: __('Name', 'blockera'),
			description: __(
				'The user name inside the about me block.',
				'blockera'
			),
			icon: <Icon icon="block-blocksy-about-name" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/icons': {
			name: 'elements/icons',
			label: __('Icons', 'blockera'),
			description: __(
				'All social media icons inside the about me block.',
				'blockera'
			),
			icon: <Icon icon="block-blocksy-about-icons" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/text': {
			name: 'elements/text',
			label: __('All Texts', 'blockera'),
			description: __(
				'All text elements inside the about me block.',
				'blockera'
			),
			icon: <Icon icon="block-blocksy-about-texts" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
