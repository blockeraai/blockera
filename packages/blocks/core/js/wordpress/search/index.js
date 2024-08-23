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

export const Search: BlockType = {
	name: 'blockeraSearch',
	targetBlock: 'core/search',
	blockeraInnerBlocks: {
		'elements/label': {
			name: 'elements/label',
			type: 'title',
			label: __('Label', 'blockera'),
			description: __('The search form label element.', 'blockera'),
			icon: <Icon icon="heading" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/input': {
			name: 'elements/input',
			label: __('Input', 'blockera'),
			description: __('The search form text input element.', 'blockera'),
			icon: <Icon icon="block-input" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/button': {
			name: 'elements/button',
			label: __('Button', 'blockera'),
			description: __('The search form button element.', 'blockera'),
			icon: <Icon icon="button" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
