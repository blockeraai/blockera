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
	arrow: {
		name: 'core/arrow',
		type: 'arrow',
		label: __('Arrow', 'blockera'),
		icon: <Icon icon="block-pagination-next-arrow" size="20" />,
		selectors: {
			root: '.wp-block-query-pagination-next-arrow',
		},
		innerBlockSettings: {
			force: true,
		},
	},
};

export const CommentsPaginationNext = {
	name: 'blockeraCommentsPaginationNext',
	targetBlock: 'core/comments-pagination-next',
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
