// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { sharedBlockExtensionAttributes } from '@blockera/editor';
import { Icon } from '@blockera/icons';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';

const attributes = sharedBlockExtensionAttributes;

const image: InnerBlocks = {
	'core/image': {
		name: 'core/image',
		label: __('Image', 'blockera'),
		icon: <Icon icon="block-image" iconSize="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
};

export default image;
