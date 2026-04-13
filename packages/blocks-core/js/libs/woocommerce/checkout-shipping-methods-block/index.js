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

export const WooCommerceCheckoutShippingMethodsBlock: BlockType = {
	name: 'blockeraWooCommerceCheckoutShippingMethodsBlock',
	targetBlock: 'woocommerce/checkout-shipping-methods-block',
	blockeraInnerBlocks: {
		'core/heading': {
			name: 'core/heading',
			label: __('Heading', 'blockera'),
			description: __(
				'The shipping methods heading element.',
				'blockera'
			),
			icon: <Icon icon="heading" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'core/description': {
			name: 'core/description',
			label: __('Description', 'blockera'),
			description: __('The shipping methods description.', 'blockera'),
			icon: <Icon icon="paragraph" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
