// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

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
			label: __('Link', 'blockera'),
			icon: <Icon icon="link" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/list-item': {
			name: 'elements/list-item',
			label: __('Link Parent', 'blockera'),
			icon: <Icon icon="block-list-item" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
