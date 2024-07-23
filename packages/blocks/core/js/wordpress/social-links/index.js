// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';
import { SharedBlockExtension } from '@blockera/editor';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';
import { Icon } from '@blockera/icons';

const blockeraInnerBlocks: InnerBlocks = {
	item_containers: {
		name: 'core/item_containers',
		type: 'item_containers',
		label: __('Buttons', 'blockera'),
		icon: <Icon icon="block-social-link-container" iconSize="20" />,
		selectors: {
			root: '.wp-block-social-link',
		},
		innerBlockSettings: {
			force: true,
		},
	},
	item_icons: {
		name: 'core/item_icons',
		type: 'item_icons',
		label: __('Buttons Icons', 'blockera'),
		icon: <Icon icon="block-social-link-icon" iconSize="20" />,
		selectors: {
			root: '.wp-block-social-link svg',
		},
		innerBlockSettings: {
			force: true,
		},
	},
	item_names: {
		name: 'core/item_names',
		type: 'item_names',
		label: __('Buttons Names', 'blockera'),
		icon: <Icon icon="block-social-link-name" iconSize="20" />,
		selectors: {
			root: '.wp-block-social-link .wp-block-social-link-label',
		},
		innerBlockSettings: {
			force: true,
		},
	},
};

export const SocialLinks = {
	name: 'blockeraSocialLinks',
	targetBlock: 'core/social-links',
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
