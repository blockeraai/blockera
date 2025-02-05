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
		'elements/text': {
			name: 'elements/text',
			label: __('Texts', 'blockera'),
			description: __(
				'All text elements inside the about me block.',
				'blockera'
			),
			icon: <Icon icon="block-blocksy-about-texts" iconSize="20" />,
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
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
