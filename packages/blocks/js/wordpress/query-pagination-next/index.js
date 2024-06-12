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
	InnerBlockLinkIcon,
} from '@blockera/editor';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';

/**
 * Internal dependencies
 */
import { InnerBlockArrowIcon } from './icons/inner-block-arrow';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

const blockeraInnerBlocks: InnerBlocks = {
	arrow: {
		name: 'core/arrow',
		type: 'arrow',
		label: __('Arrow', 'blockera'),
		icon: <InnerBlockArrowIcon />,
		selectors: {
			root: '.wp-block-query-pagination-next-arrow',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
};

export const QueryPaginationNext = {
	name: 'blockeraQueryPaginationNext',
	targetBlock: 'core/query-pagination-next',
	attributes,
	supports,
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
