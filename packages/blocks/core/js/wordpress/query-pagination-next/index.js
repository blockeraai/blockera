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
import arrow from '../inners/arrow';

// We not needs to "prev-arrow" in query-pagination-next block!
delete arrow['prev-arrow'];

export const QueryPaginationNext = {
	name: 'blockeraQueryPaginationNext',
	targetBlock: 'core/query-pagination-next',
	blockeraInnerBlocks: arrow,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
