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

const attributes = {
	...IconExtensionAttributes,
	...sharedBlockExtensionAttributes,
};

const publisherInnerBlocks: InnerBlocks = {
	link: {
		name: 'core/link',
		type: 'link',
		label: __('Links', 'publisher-core'),
		icon: <InnerBlockLinkIcon />,
		selectors: {
			root: 'a:not(.wp-element-button)',
		},
		attributes,
		innerBlockSettings: {
			force: true,
			dataCompatibility: ['font-color', 'font-color-hover'],
		},
	},
};

export const LatestPosts = {
	name: 'publisherLatestPosts',
	targetBlock: 'core/latest-posts',
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
