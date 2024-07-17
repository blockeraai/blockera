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
} from '@blockera/editor';

/**
 * Internal dependencies
 */
import paginationNumbers from '../inners/pagination-numbers';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

export const QueryPaginationNumbers = {
	name: 'blockeraQueryPaginationNumbers',
	targetBlock: 'core/query-pagination-numbers',
	attributes,
	supports,
	blockeraInnerBlocks: paginationNumbers,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
