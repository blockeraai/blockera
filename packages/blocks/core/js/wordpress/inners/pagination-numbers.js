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

const paginationNumbers: InnerBlocks = {
	'elements/numbers': {
		name: 'elements/numbers',
		label: __('Numbers', 'blockera'),
		icon: <Icon icon="block-pagination-numbers" size="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
	'elements/current': {
		name: 'elements/current',
		label: __('Current Page', 'blockera'),
		icon: <Icon icon="block-pagination-numbers-current" size="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
	'elements/dots': {
		name: 'elements/dots',
		label: __('Dots', 'blockera'),
		icon: <Icon icon="block-pagination-numbers-dots" size="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
};

export default paginationNumbers;
