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
} from '@blockera/editor-extensions/js/libs';
import type { InnerBlocks } from '@blockera/editor-extensions/js/libs/inner-blocks/types';

/**
 * Internal dependencies
 */
import { InnerBlockNumbersIcon } from './icons/inner-block-numbers';
import { InnerBlockDotsIcon } from './icons/inner-block-dots';
import { InnerBlockCurrentIcon } from './icons/inner-block-current';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

const blockeraInnerBlocks: InnerBlocks = {
	numbers: {
		name: 'core/numbers',
		type: 'numbers',
		label: __('Numbers', 'blockera'),
		icon: <InnerBlockNumbersIcon />,
		selectors: {
			root: '.page-numbers:not(.dots)',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	current: {
		name: 'core/current',
		type: 'current',
		label: __('Current Page', 'blockera'),
		icon: <InnerBlockCurrentIcon />,
		selectors: {
			root: '.page-numbers.current',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	dots: {
		name: 'core/dots',
		type: 'dots',
		label: __('Dots', 'blockera'),
		icon: <InnerBlockDotsIcon />,
		selectors: {
			root: '.page-numbers.dots',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
};

export const CommentsPaginationNumbers = {
	name: 'blockeraCommentsPaginationNumbers',
	targetBlock: 'core/comments-pagination-numbers',
	attributes,
	supports,
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
