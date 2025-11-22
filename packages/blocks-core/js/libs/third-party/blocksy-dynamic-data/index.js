// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import {
	SharedBlockExtension,
	generalInnerBlockStates,
	sharedBlockStates,
} from '@blockera/editor';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const BlocksyDynamicData: BlockType = {
	name: 'blockeraBlocksyDynamicData',
	targetBlock: 'blocksy/dynamic-data',
	blockeraInnerBlocks: {
		'elements/link': {
			name: 'elements/link',
			label: __('Link', 'blockera'),
			description: __(
				'All link elements inside the dynamic data block.',
				'blockera'
			),
			icon: <Icon icon="link" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
			availableBlockStates: {
				...generalInnerBlockStates,
				focus: {
					...generalInnerBlockStates.focus,
					force: true,
				},
				active: {
					...sharedBlockStates.active,
					force: true,
				},
				visited: sharedBlockStates.visited,
			},
		},
		'elements/image': {
			name: 'elements/image',
			label: __('Image', 'blockera'),
			description: __(
				'All image elements inside the dynamic data block.',
				'blockera'
			),
			icon: <Icon icon="image" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
