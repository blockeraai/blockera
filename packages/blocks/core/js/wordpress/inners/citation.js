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
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';
import { Icon } from '@blockera/icons';

const attributes = sharedBlockExtensionAttributes;

const citation: InnerBlocks = {
	'elements/citation': {
		name: 'elements/citation',
		label: __('Citation', 'blockera'),
		icon: <Icon icon="block-citation" iconSize="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
};

export default citation;
