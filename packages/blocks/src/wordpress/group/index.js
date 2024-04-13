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
	InnerBlockHeadingsIcon,
	InnerBlockHeading1Icon,
	InnerBlockHeading2Icon,
	InnerBlockHeading3Icon,
	InnerBlockHeading4Icon,
	InnerBlockHeading5Icon,
	InnerBlockHeading6Icon,
	InnerBlockLinkIcon,
	InnerBlockButtonIcon,
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
		},
	},
	button: {
		name: 'core/button',
		type: 'button',
		label: __('Buttons', 'publisher-core'),
		icon: <InnerBlockButtonIcon />,
		selectors: {
			root: '.wp-block-button > .wp-element-button',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	heading: {
		name: 'core/heading',
		type: 'heading',
		label: __('Headings', 'publisher-core'),
		icon: <InnerBlockHeadingsIcon />,
		selectors: {
			root: 'h1.wp-block-heading, h2.wp-block-heading, h3.wp-block-heading, h4.wp-block-heading, h5.wp-block-heading, h6.wp-block-heading',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	heading1: {
		name: 'core/heading1',
		type: 'heading1',
		label: __('H1s', 'publisher-core'),
		icon: <InnerBlockHeading1Icon />,
		selectors: {
			root: 'h1.wp-block-heading',
		},
		attributes,
		innerBlockSettings: {
			force: false,
		},
	},
	heading2: {
		name: 'core/heading2',
		type: 'heading2',
		label: __('H2s', 'publisher-core'),
		icon: <InnerBlockHeading2Icon />,
		selectors: {
			root: 'h2.wp-block-heading',
		},
		attributes,
		innerBlockSettings: {
			force: false,
		},
	},
	heading3: {
		name: 'core/heading3',
		type: 'heading3',
		label: __('H3s', 'publisher-core'),
		icon: <InnerBlockHeading3Icon />,
		selectors: {
			root: 'h3.wp-block-heading',
		},
		attributes,
		innerBlockSettings: {
			force: false,
		},
	},
	heading4: {
		name: 'core/heading4',
		type: 'heading4',
		label: __('H4s', 'publisher-core'),
		icon: <InnerBlockHeading4Icon />,
		selectors: {
			root: 'h4.wp-block-heading',
		},
		attributes,
		innerBlockSettings: {
			force: false,
		},
	},
	heading5: {
		name: 'core/heading5',
		type: 'heading5',
		label: __('H5s', 'publisher-core'),
		icon: <InnerBlockHeading5Icon />,
		selectors: {
			root: 'h5.wp-block-heading',
		},
		attributes,
		innerBlockSettings: {
			force: false,
		},
	},
	heading6: {
		name: 'core/heading6',
		type: 'heading6',
		label: __('H6s', 'publisher-core'),
		icon: <InnerBlockHeading6Icon />,
		selectors: {
			root: 'h6.wp-block-heading',
		},
		attributes,
		innerBlockSettings: {
			force: false,
		},
	},
};

export const Group = {
	name: 'publisherGroup',
	targetBlock: 'core/group',
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
