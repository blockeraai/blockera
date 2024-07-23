// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';
import { Icon } from '@blockera/icons';

const blockeraInnerBlocks: InnerBlocks = {
	link: {
		name: 'core/term-item',
		type: 'link',
		label: __('Term Items', 'blockera'),
		icon: <Icon icon="block-post-terms-term" iconSize="20" />,
		selectors: {
			root: 'a:not(.wp-element-button)',
		},
		innerBlockSettings: {
			force: true,
		},
	},
	separator: {
		name: 'core/separator',
		type: 'separator',
		label: __('Separator', 'blockera'),
		icon: <Icon icon="block-post-terms-separator" iconSize="20" />,
		selectors: {
			root: '.wp-block-post-terms__separator',
		},
		innerBlockSettings: {
			force: true,
		},
	},
	prefix: {
		name: 'core/prefix',
		type: 'prefix',
		label: __('Prefix Text', 'blockera'),
		icon: <Icon icon="block-post-terms-prefix" iconSize="20" />,
		selectors: {
			root: '.wp-block-post-terms__prefix',
		},
		innerBlockSettings: {
			force: true,
		},
	},
	suffix: {
		name: 'core/suffix',
		type: 'suffix',
		label: __('Suffix Text', 'blockera'),
		icon: <Icon icon="block-post-terms-suffix" iconSize="20" />,
		selectors: {
			root: '.wp-block-post-terms__suffix',
		},
		innerBlockSettings: {
			force: true,
		},
	},
};

export const PostTerms = {
	name: 'blockeraPostTerms',
	targetBlock: 'core/post-terms',
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
