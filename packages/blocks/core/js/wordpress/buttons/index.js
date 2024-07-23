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
import { Icon } from '@blockera/icons';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';

const blockeraInnerBlocks: InnerBlocks = {
	button: {
		name: 'core/button',
		type: 'button',
		label: __('Buttons', 'blockera'),
		icon: <Icon icon="block-button" iconSize="20" />,
		selectors: {
			root: '.wp-block-button > .wp-element-button',
		},
		innerBlockSettings: {
			force: true,
		},
	},
};

export const Buttons = {
	name: 'blockeraButtons',
	targetBlock: 'core/buttons',
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
