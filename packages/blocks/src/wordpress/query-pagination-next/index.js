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
	IconExtensionSupports,
	IconExtensionAttributes,
	InnerBlockLinkIcon,
} from '@blockera/extensions/src/libs';
import type { InnerBlocks } from '@blockera/extensions/src/libs/inner-blocks/types';

/**
 * Internal dependencies
 */
import { InnerBlockArrowIcon } from './icons/inner-block-arrow';

const attributes = {
	...IconExtensionAttributes,
	...sharedBlockExtensionAttributes,
};

const blockeraInnerBlocks: InnerBlocks = {
	arrow: {
		name: 'core/arrow',
		type: 'arrow',
		label: __('Arrow', 'blockera-core'),
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
	supports: {
		...IconExtensionSupports,
		...sharedBlockExtensionSupports,
	},
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
