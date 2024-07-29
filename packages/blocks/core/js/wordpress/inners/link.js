// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';

const link: InnerBlocks = {
	'elements/link': {
		name: 'elements/link',
		label: __('Link', 'blockera'),
		icon: <Icon icon="link" library="wp" iconSize="20" />,
		settings: {
			force: true,
			dataCompatibility: ['font-color', 'font-color-hover'],
		},
	},
};

export default link;
