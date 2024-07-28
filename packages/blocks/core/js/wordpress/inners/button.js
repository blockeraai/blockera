// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';
import { Icon } from '@blockera/icons';

const button: InnerBlocks = {
	'core/button': {
		name: 'core/button',
		label: __('Button', 'blockera'),
		icon: <Icon icon="block-button" iconSize="20" />,
		settings: {
			force: true,
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
};

export default button;
