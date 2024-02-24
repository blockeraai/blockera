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
	InnerBlockParagraphIcon,
	InnerBlockCitationIcon,
	InnerBlockHeadingsIcon,
	InnerBlockHeading1Icon,
	InnerBlockHeading2Icon,
	InnerBlockHeading3Icon,
	InnerBlockHeading4Icon,
	InnerBlockHeading5Icon,
	InnerBlockHeading6Icon,
	InnerBlockLinkIcon,
} from '@publisher/extensions';
import type { InnerBlocks } from '@publisher/extensions/src/libs/inner-blocks/types';

const attributes = {
	...IconExtensionAttributes,
	...sharedBlockExtensionAttributes,
};

const publisherInnerBlocks: InnerBlocks = {
	citation: {
		name: 'citation',
		type: 'citation',
		label: 'Citation',
		icon: <InnerBlockCitationIcon />,
		selectors: {
			root: 'cite',
			publisherBackground: {},
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
		settings: {
			backgroundConfig: {
				publisherBackground: {
					force: false,
					show: false,
				},
			},
		},
	},
	link: {
		name: 'core/link',
		type: 'link',
		label: __('Link', 'publisher-core'),
		icon: <InnerBlockLinkIcon />,
		selectors: {
			root: 'a',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	paragraph: {
		name: 'core/paragraph',
		type: 'paragraph',
		label: __('Paragraphs', 'publisher-core'),
		icon: <InnerBlockParagraphIcon />,
		selectors: {
			root: 'p',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	heading: {
		name: 'core/heading',
		type: 'heading',
		label: __('All Headings', 'publisher-core'),
		icon: <InnerBlockHeadingsIcon />,
		selectors: {
			root: 'h1, h2, h3, h4, h5, h6',
		},
		attributes,
		innerBlockSettings: {
			force: false,
		},
	},
	heading1: {
		name: 'core/heading1',
		type: 'heading1',
		label: __('H1', 'publisher-core'),
		icon: <InnerBlockHeading1Icon />,
		selectors: {
			root: 'h1',
		},
		attributes,
		innerBlockSettings: {
			force: false,
		},
	},
	heading2: {
		name: 'core/heading2',
		type: 'heading2',
		label: __('H2', 'publisher-core'),
		icon: <InnerBlockHeading2Icon />,
		selectors: {
			root: 'h2',
		},
		attributes,
		innerBlockSettings: {
			force: false,
		},
	},
	heading3: {
		name: 'core/heading3',
		type: 'heading3',
		label: __('H3', 'publisher-core'),
		icon: <InnerBlockHeading3Icon />,
		selectors: {
			root: 'h3',
		},
		attributes,
		innerBlockSettings: {
			force: false,
		},
	},
	heading4: {
		name: 'core/heading4',
		type: 'heading4',
		label: __('H4', 'publisher-core'),
		icon: <InnerBlockHeading4Icon />,
		selectors: {
			root: 'h4',
		},
		attributes,
		innerBlockSettings: {
			force: false,
		},
	},
	heading5: {
		name: 'core/heading5',
		type: 'heading5',
		label: __('H5', 'publisher-core'),
		icon: <InnerBlockHeading5Icon />,
		selectors: {
			root: 'h5',
		},
		attributes,
		innerBlockSettings: {
			force: false,
		},
	},
	heading6: {
		name: 'core/heading6',
		type: 'heading6',
		label: __('H6', 'publisher-core'),
		icon: <InnerBlockHeading6Icon />,
		selectors: {
			root: 'h6',
		},
		attributes,
		innerBlockSettings: {
			force: false,
		},
	},
};

export const Quote = {
	name: 'publisherQuote',
	targetBlock: 'core/quote',
	attributes,
	supports: {
		...IconExtensionSupports,
		...sharedBlockExtensionSupports,
	},
	publisherInnerBlocks,
	publisherStatesConfig: {
		disabledSelectors: ['.a', '.b'],
	},
	publisherBreakpointsConfig: {
		// $FlowFixMe
		disabledSelectors: [],
	},
	getSelectors: (selectors: Object): Object => {
		const { root, backgroundColor } = selectors;

		return {
			...selectors,
			publisherBackgroundColor: backgroundColor || root,
		};
	},
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
