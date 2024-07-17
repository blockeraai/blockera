// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { sharedBlockExtensionAttributes } from '@blockera/editor';
import { Icon } from '@blockera/icons';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';

const attributes = sharedBlockExtensionAttributes;

const link: InnerBlocks = {
	link: {
		name: 'elements/link',
		label: __('Links', 'blockera'),
		icon: <Icon icon="block-link" iconSize="20" />,
		attributes,
		settings: {
			force: true,
			dataCompatibility: ['font-color', 'font-color-hover'],
		},
	},
};

export default link;
