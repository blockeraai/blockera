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
 **/
import { InnerBlockListItemIcon } from './icons/inner-block-list-item';

const attributes = {
	...IconExtensionAttributes,
	...sharedBlockExtensionAttributes,
};

const blockeraInnerBlocks: InnerBlocks = {
	term: {
		name: 'core/term-item',
		type: 'term',
		label: __('Link', 'blockera-core'),
		icon: <InnerBlockLinkIcon />,
		selectors: {
			root: 'li.cat-item > a',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	item: {
		name: 'core/list-item',
		type: 'list-item',
		label: __('Link Parent', 'blockera-core'),
		icon: <InnerBlockListItemIcon />,
		selectors: {
			root: 'li.cat-item',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
};

export const Categories = {
	name: 'blockeraCategories',
	targetBlock: 'core/categories',
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
