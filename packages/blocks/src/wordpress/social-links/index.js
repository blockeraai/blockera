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
	InnerBlockLinkIcon,
} from '@publisher/extensions';
import type { InnerBlocks } from '@publisher/extensions/src/libs/inner-blocks/types';

/**
 * Internal dependencies
 */
import { InnerBlockItemContainerIcon } from './icons/inner-block-item-container';
import { InnerBlockItemNameIcon } from './icons/inner-block-item-name';
import { InnerBlockItemIconIcon } from './icons/inner-block-item-icon';

const attributes = {
	...IconExtensionAttributes,
	...sharedBlockExtensionAttributes,
};

const publisherInnerBlocks: InnerBlocks = {
	item_containers: {
		name: 'core/item_containers',
		type: 'item_containers',
		label: __('Buttons', 'publisher-core'),
		icon: <InnerBlockItemContainerIcon />,
		selectors: {
			root: '.wp-block-social-link',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	item_icons: {
		name: 'core/item_icons',
		type: 'item_icons',
		label: __('Buttons Icons', 'publisher-core'),
		icon: <InnerBlockItemIconIcon />,
		selectors: {
			root: '.wp-block-social-link svg',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	item_names: {
		name: 'core/item_names',
		type: 'item_names',
		label: __('Buttons Names', 'publisher-core'),
		icon: <InnerBlockItemNameIcon />,
		selectors: {
			root: '.wp-block-social-link .wp-block-social-link-label',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
};

export const SocialLinks = {
	name: 'publisherSocialLinks',
	targetBlock: 'core/social-links',
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
