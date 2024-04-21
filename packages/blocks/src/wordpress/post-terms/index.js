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
} from '@blockera/extensions';
import type { InnerBlocks } from '@blockera/extensions/src/libs/inner-blocks/types';

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

const blockeraInnerBlocks: InnerBlocks = {
	link: {
		name: 'core/term-item',
		type: 'link',
		label: __('Term Items', 'blockera-core'),
		icon: <InnerBlockTermIcon />,
		selectors: {
			root: 'a:not(.wp-element-button)',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	separator: {
		name: 'core/separator',
		type: 'separator',
		label: __('Separator', 'blockera-core'),
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
		label: __('Prefix Text', 'blockera-core'),
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
		label: __('Suffix Text', 'blockera-core'),
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
	name: 'blockeraPostTerms',
	targetBlock: 'core/post-terms',
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
