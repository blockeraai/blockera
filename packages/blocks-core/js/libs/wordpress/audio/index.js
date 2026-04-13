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
import sharedInnerBlocks from '../inners/shared';

export const Audio: BlockType = {
	name: 'blockeraAudio',
	targetBlock: 'core/audio',
	blockeraInnerBlocks: {
		'elements/caption': {
			name: 'elements/caption',
			label: __('Caption', 'blockera'),
			description: __(
				'The audio caption element inside audio block.',
				'blockera'
			),
			icon: <Icon icon="block-audio-caption" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
