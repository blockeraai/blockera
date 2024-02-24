// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	SharedBlockExtension,
	sharedBlockExtensionSupports,
	sharedBlockExtensionAttributes,
	IconExtensionSupports,
	IconExtensionAttributes,
	InnerBlockLinkIcon,
} from '@publisher/extensions';
import type { InnerBlocks } from '@publisher/extensions/src/libs/inner-blocks/types';

/**
 * Internal dependencies
 **/
import { InnerBlockListItemIcon } from './icons/inner-block-list-item';

const attributes = {
	...IconExtensionAttributes,
	...sharedBlockExtensionAttributes,
};

const publisherInnerBlocks: InnerBlocks = {
	term: {
		name: 'core/term-item',
		type: 'term',
		label: __('Link', 'publisher-core'),
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
		label: __('Link Parent', 'publisher-core'),
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
	name: 'publisherCategories',
	targetBlock: 'core/categories',
	attributes,
	supports: {
		...IconExtensionSupports,
		...sharedBlockExtensionSupports,
	},
	publisherInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
