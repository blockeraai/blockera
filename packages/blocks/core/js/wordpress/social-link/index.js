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
} from '@blockera/editor';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';
import { Icon } from '@blockera/icons';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

const blockeraInnerBlocks: InnerBlocks = {
	item_icon: {
		name: 'elements/item-icon',
		label: __('Button Icon', 'blockera'),
		icon: <Icon icon="block-social-link-icon" iconSize="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
	item_name: {
		name: 'elements/item-name',
		label: __('Button Name', 'blockera'),
		icon: <Icon icon="block-social-link-name" iconSize="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
};

export const SocialLink = {
	name: 'blockeraSocialLink',
	targetBlock: 'core/social-link',
	attributes,
	supports,
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
