// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const QueryPaginationPrevious: BlockType = {
	name: 'blockeraQueryPaginationPrevious',
	targetBlock: 'core/query-pagination-previous',
	blockeraInnerBlocks: {
		'elements/arrow': {
			name: 'elements/arrow',
			label: __('Arrow', 'blockera'),
			icon: <Icon icon="block-pagination-previous-arrow" size="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
