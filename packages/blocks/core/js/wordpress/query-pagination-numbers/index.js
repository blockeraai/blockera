// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import paginationNumbers from '../inners/pagination-numbers';

export const QueryPaginationNumbers = {
	name: 'blockeraQueryPaginationNumbers',
	targetBlock: 'core/query-pagination-numbers',
	blockeraInnerBlocks: paginationNumbers,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
