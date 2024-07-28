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

const arrow: InnerBlocks = {
	'elements/next-arrow': {
		name: 'elements/next-arrow',
		label: __('Arrow', 'blockera'),
		icon: <Icon icon="block-pagination-next-arrow" size="20" />,
		settings: {
			force: true,
		},
	},
	'elements/prev-arrow': {
		name: 'elements/prev-arrow',
		label: __('Arrow', 'blockera'),
		icon: <Icon icon="block-pagination-previous-arrow" size="20" />,
		innerBlockSettings: {
			force: true,
		},
	},
};

export default arrow;
