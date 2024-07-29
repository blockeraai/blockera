// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';

const image: InnerBlocks = {
	'core/image': {
		name: 'core/image',
		label: __('Image', 'blockera'),
		icon: <Icon icon="image" library="wp" iconSize="20" />,
		settings: {
			force: true,
		},
	},
};

export default image;
