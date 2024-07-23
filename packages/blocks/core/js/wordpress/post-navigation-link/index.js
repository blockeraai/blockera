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
		name: 'core/link',
		type: 'link',
		label: __('Links', 'blockera'),
		icon: <Icon icon="block-link" iconSize="20" />,
		selectors: {
			root: 'a:not(.wp-element-button)',
		},
		innerBlockSettings: {
			force: true,
			dataCompatibility: ['font-color', 'font-color-hover'],
		},
	},
};

export const PostNavigationLink = {
	name: 'blockeraPostNavigationLink',
	targetBlock: 'core/post-navigation-link',
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
