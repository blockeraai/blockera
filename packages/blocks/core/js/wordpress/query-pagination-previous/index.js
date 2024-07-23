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
		icon: <Icon icon="block-pagination-previous-arrow" size="20" />,
		selectors: {
			root: '.wp-block-query-pagination-previous-arrow',
		},
		innerBlockSettings: {
			force: true,
		},
	},
};

export const QueryPaginationPrevious = {
	name: 'blockeraQueryPaginationPrevious',
	targetBlock: 'core/query-pagination-previous',
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
