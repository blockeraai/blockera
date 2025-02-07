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

export const BlocksySocials: BlockType = {
	name: 'blockeraBlocksySocials',
	targetBlock: 'blocksy/socials',
	blockeraInnerBlocks: {
		'elements/icons': {
			name: 'elements/icons',
			label: __('Icons', 'blockera'),
			description: __(
				'All social media icons inside the socials block.',
				'blockera'
			),
			icon: <Icon icon="share" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
