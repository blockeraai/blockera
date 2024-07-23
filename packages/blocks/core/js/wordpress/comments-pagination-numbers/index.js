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
	numbers: {
		name: 'core/numbers',
		type: 'numbers',
		label: __('Numbers', 'blockera'),
		icon: <Icon icon="block-pagination-numbers" size="20" />,
		selectors: {
			root: '.page-numbers:not(.dots)',
		},
		innerBlockSettings: {
			force: true,
		},
	},
	current: {
		name: 'core/current',
		type: 'current',
		label: __('Current Page', 'blockera'),
		icon: <Icon icon="block-pagination-numbers-current" size="20" />,
		selectors: {
			root: '.page-numbers.current',
		},
		innerBlockSettings: {
			force: true,
		},
	},
	dots: {
		name: 'core/dots',
		type: 'dots',
		label: __('Dots', 'blockera'),
		icon: <Icon icon="block-pagination-numbers-dots" size="20" />,
		selectors: {
			root: '.page-numbers.dots',
		},
		innerBlockSettings: {
			force: true,
		},
	},
};

export const CommentsPaginationNumbers = {
	name: 'blockeraCommentsPaginationNumbers',
	targetBlock: 'core/comments-pagination-numbers',
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
