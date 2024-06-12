// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	SharedBlockExtension,
	sharedBlockExtensionSupports,
	sharedBlockExtensionAttributes,
	InnerBlockParagraphIcon,
	InnerBlockButtonIcon,
	InnerBlockInputIcon,
} from '@blockera/editor';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

const blockeraInnerBlocks: InnerBlocks = {
	label: {
		name: 'core/title',
		type: 'title',
		label: __('Form Label', 'blockera'),
		icon: <InnerBlockParagraphIcon />,
		selectors: {
			root: '.wp-block-search__label',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	input: {
		name: 'input',
		type: 'input',
		label: __('Form Input', 'blockera'),
		icon: <InnerBlockInputIcon />,
		selectors: {
			root: '.wp-block-search__input',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	button: {
		name: 'core/button',
		type: 'button',
		label: __('Form Button', 'blockera'),
		icon: <InnerBlockButtonIcon />,
		selectors: {
			root: '.wp-block-search__button',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
};

export const Search = {
	name: 'blockeraSearch',
	targetBlock: 'core/search',
	attributes,
	supports,
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
