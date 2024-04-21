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
 */
import { InnerBlockNumbersIcon } from './icons/inner-block-numbers';
import { InnerBlockDotsIcon } from './icons/inner-block-dots';
import { InnerBlockCurrentIcon } from './icons/inner-block-current';

const attributes = {
	...IconExtensionAttributes,
	...sharedBlockExtensionAttributes,
};

const publisherInnerBlocks: InnerBlocks = {
	numbers: {
		name: 'core/numbers',
		type: 'numbers',
		label: __('Numbers', 'publisher-core'),
		icon: <InnerBlockNumbersIcon />,
		selectors: {
			root: '.page-numbers:not(.dots)',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	current: {
		name: 'core/current',
		type: 'current',
		label: __('Current Page', 'publisher-core'),
		icon: <InnerBlockCurrentIcon />,
		selectors: {
			root: '.page-numbers.current',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	dots: {
		name: 'core/dots',
		type: 'dots',
		label: __('Dots', 'publisher-core'),
		icon: <InnerBlockDotsIcon />,
		selectors: {
			root: '.page-numbers.dots',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
};

export const CommentsPaginationNumbers = {
	name: 'publisherCommentsPaginationNumbers',
	targetBlock: 'core/comments-pagination-numbers',
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
