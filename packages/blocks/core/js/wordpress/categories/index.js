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

export const Categories: BlockType = {
	name: 'blockeraCategories',
	targetBlock: 'core/categories',
	blockeraInnerBlocks: {
		'elements/term-item': {
			name: 'elements/term-item',
			label: __('Terms', 'blockera'),
			description: __('All term elements.', 'blockera'),
			icon: <Icon icon="block-list-item" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/list-item': {
			name: 'elements/list-item',
			label: __('Terms Container', 'blockera'),
			description: __('All terms container elements.', 'blockera'),
			icon: <Icon icon="block-list-item-container" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
