// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	SharedBlockExtension,
	sharedBlockExtensionSupports,
	sharedBlockExtensionAttributes,
} from '@blockera/editor';

/**
 * Internal dependencies
 */
import arrow from '../inners/arrow';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

// We not needs to "prev-arrow" in query-pagination-next block!
delete arrow['prev-arrow'];

export const QueryPaginationNext = {
	name: 'blockeraQueryPaginationNext',
	targetBlock: 'core/query-pagination-next',
	attributes,
	supports,
	blockeraInnerBlocks: arrow,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
