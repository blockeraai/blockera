// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { sharedBlockExtensionAttributes } from '@blockera/editor';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';
import { Icon } from '@blockera/icons';

const attributes = sharedBlockExtensionAttributes;

const arrow: InnerBlocks = {
	'next-arrow': {
		name: 'elements/next-arrow',
		label: __('Arrow', 'blockera'),
		icon: <Icon icon="block-pagination-next-arrow" size="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
	'prev-arrow': {
		name: 'elements/prev-arrow',
		label: __('Arrow', 'blockera'),
		icon: <Icon icon="block-pagination-previous-arrow" size="20" />,
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
};

export default arrow;
