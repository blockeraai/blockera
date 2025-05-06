// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@blockera/icons';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const Table: BlockType = {
	name: 'blockeraTable',
	targetBlock: 'core/table',
	blockeraInnerBlocks: {
		'elements/caption': {
			name: 'elements/caption',
			label: __('Caption', 'blockera'),
			description: __('The table caption.', 'blockera'),
			icon: <Icon icon="target" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/header-cells': {
			name: 'elements/header-cells',
			label: __('Header → Cells', 'blockera'),
			description: __('The table header cells.', 'blockera'),
			icon: <Icon icon="target" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/body-cells': {
			name: 'elements/body-cells',
			label: __('Body → Cells', 'blockera'),
			description: __('The table body cells.', 'blockera'),
			icon: <Icon icon="target" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/footer-cells': {
			name: 'elements/footer-cells',
			label: __('Footer → Cells', 'blockera'),
			description: __('The table footer cells.', 'blockera'),
			icon: <Icon icon="target" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
