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
	item_containers: {
		name: 'elements/item-containers',
		label: __('Buttons', 'blockera'),
		icon: <Icon icon="block-social-link-container" iconSize="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
	item_icons: {
		name: 'elements/item-icons',
		label: __('Buttons Icons', 'blockera'),
		icon: <Icon icon="block-social-link-icon" iconSize="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
	item_names: {
		name: 'elements/item-names',
		label: __('Buttons Names', 'blockera'),
		icon: <Icon icon="block-social-link-name" iconSize="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
};

export const SocialLinks = {
	name: 'blockeraSocialLinks',
	targetBlock: 'core/social-links',
	attributes,
	supports,
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
