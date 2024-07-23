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
import {
	SharedBlockExtension,
	sharedBlockExtensionSupports,
	sharedBlockExtensionAttributes,
} from '@blockera/editor';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';
import { Icon } from '@blockera/icons';

const attributes: Object = mergeObject(sharedBlockExtensionAttributes, {
	blockeraDisplay: {
		default: 'flex',
	},
});

const supports = sharedBlockExtensionSupports;

const blockeraInnerBlocks: InnerBlocks = {
	button: {
		name: 'core/button',
		type: 'button',
		label: __('Buttons', 'blockera'),
		icon: <Icon icon="block-button" iconSize="20" />,
		selectors: {
			root: '.wp-block-button > .wp-element-button',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
};

export const Buttons = {
	name: 'blockeraButtons',
	targetBlock: 'core/buttons',
	blockeraInnerBlocks,
	attributes,
	supports,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
