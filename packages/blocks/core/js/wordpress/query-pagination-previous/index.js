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

// We not needs to "next-arrow" in query-pagination-previous block!
delete arrow['next-arrow'];

export const QueryPaginationPrevious = {
	name: 'blockeraQueryPaginationPrevious',
	targetBlock: 'core/query-pagination-previous',
	attributes,
	supports,
	blockeraInnerBlocks: arrow,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
