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
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../type';

export const Details: BlockType = {
	name: 'blockeraDetails',
	targetBlock: 'core/details',
	blockeraInnerBlocks: {
		'elements/title': {
			name: 'elements/title',
			type: 'title',
			label: __('Title', 'blockera'),
			description: __('The title of details block.', 'blockera'),
			icon: <Icon icon="heading" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/title-icon': {
			name: 'elements/title-icon',
			type: 'title',
			label: __('Title Icon', 'blockera'),
			description: __('Chevron down icon of title.', 'blockera'),
			icon: <Icon icon="chevron-down" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'core/paragraph': sharedInnerBlocks['core/paragraph'],
		'elements/link': sharedInnerBlocks['elements/link'],
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
