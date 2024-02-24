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
} from '@publisher/extensions';
import type { InnerBlocks } from '@publisher/extensions/src/libs/inner-blocks/types';

/**
 * Internal dependencies
 **/
import { InnerBlockSeparatorIcon } from './icons/inner-block-separator';
import { InnerBlockPrefixIcon } from './icons/inner-block-prefix';
import { InnerBlockSuffixIcon } from './icons/inner-block-suffix';
import { InnerBlockTermIcon } from './icons/inner-block-term';

const attributes = {
	...IconExtensionAttributes,
	...sharedBlockExtensionAttributes,
};

const publisherInnerBlocks: InnerBlocks = {
	link: {
		name: 'core/term-item',
		type: 'link',
		label: __('Term Items', 'publisher-core'),
		icon: <InnerBlockTermIcon />,
		selectors: {
			root: 'a',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	separator: {
		name: 'core/separator',
		type: 'separator',
		label: __('Separator', 'publisher-core'),
		icon: <InnerBlockSeparatorIcon />,
		selectors: {
			root: '.wp-block-post-terms__separator',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	prefix: {
		name: 'core/prefix',
		type: 'prefix',
		label: __('Prefix Text', 'publisher-core'),
		icon: <InnerBlockPrefixIcon />,
		selectors: {
			root: '.wp-block-post-terms__prefix',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	suffix: {
		name: 'core/suffix',
		type: 'suffix',
		label: __('Suffix Text', 'publisher-core'),
		icon: <InnerBlockSuffixIcon />,
		selectors: {
			root: '.wp-block-post-terms__suffix',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
};

export const PostTerms = {
	name: 'publisherPostTerms',
	targetBlock: 'core/post-terms',
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
