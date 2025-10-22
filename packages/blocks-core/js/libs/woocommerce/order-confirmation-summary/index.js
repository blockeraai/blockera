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

export const WooCommerceOrderConfirmationSummary: BlockType = {
	name: 'blockeraWooCommerceOrderConfirmationSummary',
	targetBlock: 'woocommerce/order-confirmation-summary',
	blockeraInnerBlocks: {
		'elements/item': {
			name: 'elements/item',
			label: __('Item Container', 'blockera'),
			description: __(
				'The container element of each summary item.',
				'blockera'
			),
			icon: (
				<Icon
					icon="block-order-confirmation-summary-item-container"
					library="ui"
					iconSize="24"
				/>
			),
			settings: {
				force: true,
			},
		},
		'elements/item-title': {
			name: 'elements/item-title',
			label: __('Item Title', 'blockera'),
			description: __(
				'The title element of all summary items.',
				'blockera'
			),
			icon: (
				<Icon
					icon="block-order-confirmation-summary-item-title"
					library="ui"
					iconSize="24"
				/>
			),
			settings: {
				force: true,
			},
		},
		'elements/item-value': {
			name: 'elements/item-value',
			label: __('Item Value', 'blockera'),
			description: __(
				'The value element of all summary items.',
				'blockera'
			),
			icon: (
				<Icon
					icon="block-order-confirmation-summary-item-value"
					library="ui"
					iconSize="24"
				/>
			),
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
