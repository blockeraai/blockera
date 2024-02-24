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

const attributes = {
	...IconExtensionAttributes,
	...sharedBlockExtensionAttributes,
};

const publisherInnerBlocks: Object = {
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
	},
	heading1: {
		name: 'core/heading1',
		type: 'heading1',
		label: __('Heading 1', 'publisher-core'),
		icon: <InnerBlockHeading1Icon />,
		selectors: {
			root: 'h1',
		},
		attributes,
	},
	heading2: {
		name: 'core/heading2',
		type: 'heading2',
		label: __('Heading 2', 'publisher-core'),
		icon: <InnerBlockHeading2Icon />,
		selectors: {
			root: 'h2',
		},
		attributes,
	},
	heading3: {
		name: 'core/heading3',
		type: 'heading3',
		label: __('Heading 3', 'publisher-core'),
		icon: <InnerBlockHeading3Icon />,
		selectors: {
			root: 'h3',
		},
		attributes,
	},
	heading4: {
		name: 'core/heading4',
		type: 'heading4',
		label: __('Heading 4', 'publisher-core'),
		icon: <InnerBlockHeading4Icon />,
		selectors: {
			root: 'h4',
		},
		attributes,
	},
	heading5: {
		name: 'core/heading5',
		type: 'heading5',
		label: __('Heading 5', 'publisher-core'),
		icon: <InnerBlockHeading5Icon />,
		selectors: {
			root: 'h5',
		},
		attributes,
	},
	heading6: {
		name: 'core/heading6',
		type: 'heading6',
		label: __('Heading 6', 'publisher-core'),
		icon: <InnerBlockHeading6Icon />,
		selectors: {
			root: 'h6',
		},
		attributes,
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
