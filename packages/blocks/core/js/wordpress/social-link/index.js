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
	item_icon: {
		name: 'core/item_icon',
		type: 'item_icon',
		label: __('Button Icon', 'blockera'),
		icon: <Icon icon="block-social-link-icon" iconSize="20" />,
		selectors: {
			root: 'svg',
		},
		innerBlockSettings: {
			force: true,
		},
	},
	item_name: {
		name: 'core/item_name',
		type: 'item_name',
		label: __('Button Name', 'blockera'),
		icon: <Icon icon="block-social-link-name" iconSize="20" />,
		selectors: {
			root: '.wp-block-social-link-label',
		},
		innerBlockSettings: {
			force: true,
		},
	},
};

export const SocialLink = {
	name: 'blockeraSocialLink',
	targetBlock: 'core/social-link',
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
