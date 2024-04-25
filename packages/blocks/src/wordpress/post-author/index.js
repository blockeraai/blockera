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
	InnerBlockImageIcon,
	InnerBlockParagraphIcon,
} from '@blockera/extensions/src/libs';
import type { InnerBlocks } from '@blockera/extensions/src/libs/inner-blocks/types';

/**
 * Internal dependencies
 */
import { InnerBlockAvatarIcon } from './icons/inner-block-avatar';
import { InnerBlockBylineIcon } from './icons/inner-block-byline';
import { InnerBlockNameIcon } from './icons/inner-block-name';

const attributes = {
	...IconExtensionAttributes,
	...sharedBlockExtensionAttributes,
};

const blockeraInnerBlocks: InnerBlocks = {
	avatar: {
		name: 'core/avatar',
		type: 'avatar',
		label: __('Avatar', 'blockera-core'),
		icon: <InnerBlockAvatarIcon />,
		selectors: {
			root: '.wp-block-post-author__avatar > img',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	byline: {
		name: 'core/byline',
		type: 'byline',
		label: __('Byline', 'blockera-core'),
		icon: <InnerBlockBylineIcon />,
		selectors: {
			root: '.wp-block-post-author__byline',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	author: {
		name: 'core/author',
		type: 'author',
		label: __('Name', 'blockera-core'),
		icon: <InnerBlockNameIcon />,
		selectors: {
			root: '.wp-block-post-author__name',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	link: {
		name: 'core/link',
		type: 'link',
		label: __('Link', 'blockera-core'),
		icon: <InnerBlockLinkIcon />,
		selectors: {
			root: 'a:not(.wp-element-button)',
		},
		attributes,
		innerBlockSettings: {
			force: true,
			dataCompatibility: ['font-color', 'font-color-hover'],
		},
	},
};

export const PostAuthor = {
	name: 'blockeraPostAuthor',
	targetBlock: 'core/post-author',
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
