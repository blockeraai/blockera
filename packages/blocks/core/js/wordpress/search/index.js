// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';
import { Icon } from '@blockera/icons';

const blockeraInnerBlocks: InnerBlocks = {
	label: {
		name: 'core/title',
		type: 'title',
		label: __('Form Label', 'blockera'),
		icon: <Icon icon="block-paragraph" iconSize="20" />,
		selectors: {
			root: '.wp-block-search__label',
		},
		innerBlockSettings: {
			force: true,
		},
	},
	input: {
		name: 'input',
		type: 'input',
		label: __('Form Input', 'blockera'),
		icon: <Icon icon="block-input" iconSize="20" />,
		selectors: {
			root: '.wp-block-search__input',
		},
		innerBlockSettings: {
			force: true,
		},
	},
	button: {
		name: 'core/button',
		type: 'button',
		label: __('Form Button', 'blockera'),
		icon: <Icon icon="block-button" iconSize="20" />,
		selectors: {
			root: '.wp-block-search__button',
		},
		innerBlockSettings: {
			force: true,
		},
	},
};

export const Search = {
	name: 'blockeraSearch',
	targetBlock: 'core/search',
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
