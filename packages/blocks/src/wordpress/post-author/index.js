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
	InnerBlockImageIcon,
	InnerBlockParagraphIcon,
} from '@publisher/extensions';
import type { InnerBlocks } from '@publisher/extensions/src/libs/inner-blocks/types';

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

const publisherInnerBlocks: InnerBlocks = {
	avatar: {
		name: 'core/avatar',
		type: 'avatar',
		label: __('Avatar', 'publisher-core'),
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
		label: __('Byline', 'publisher-core'),
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
		label: __('Name', 'publisher-core'),
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
		label: __('Link', 'publisher-core'),
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
	name: 'publisherPostAuthor',
	targetBlock: 'core/post-author',
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
