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
} from '@publisher/extensions';
import type { InnerBlocks } from '@publisher/extensions/src/libs/inner-blocks/types';

/**
 * Internal dependencies
 */
import { InnerBlockItemNameIcon } from './icons/inner-block-item-name';
import { InnerBlockItemIconIcon } from './icons/inner-block-item-icon';

const attributes = {
	...IconExtensionAttributes,
	...sharedBlockExtensionAttributes,
};

const publisherInnerBlocks: InnerBlocks = {
	item_icon: {
		name: 'core/item_icon',
		type: 'item_icon',
		label: __('Button Icon', 'publisher-core'),
		icon: <InnerBlockItemIconIcon />,
		selectors: {
			root: 'svg',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	item_name: {
		name: 'core/item_name',
		type: 'item_name',
		label: __('Button Name', 'publisher-core'),
		icon: <InnerBlockItemNameIcon />,
		selectors: {
			root: '.wp-block-social-link-label',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
};

export const SocialLink = {
	name: 'publisherSocialLink',
	targetBlock: 'core/social-link',
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
