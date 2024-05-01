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
	IconExtensionSupports,
	IconExtensionAttributes,
	InnerBlockParagraphIcon,
	InnerBlockButtonIcon,
	InnerBlockInputIcon,
} from '@blockera/editor-extensions/js/libs';
import type { InnerBlocks } from '@blockera/editor-extensions/js/libs/inner-blocks/types';

const attributes = {
	...IconExtensionAttributes,
	...sharedBlockExtensionAttributes,
};

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
	supports: {
		...IconExtensionSupports,
		...sharedBlockExtensionSupports,
	},
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
