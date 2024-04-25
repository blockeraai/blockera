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
	IconExtensionSupports,
	IconExtensionAttributes,
	InnerBlockParagraphIcon,
	InnerBlockCitationIcon,
	InnerBlockLinkIcon,
} from '@blockera/extensions/src/libs';
import type { InnerBlocks } from '@blockera/extensions/src/libs/inner-blocks/types';

const attributes = {
	...IconExtensionAttributes,
	...sharedBlockExtensionAttributes,
};

const blockeraInnerBlocks: InnerBlocks = {
	citation: {
		name: 'citation',
		type: 'citation',
		label: __('Citation', 'blockera-core'),
		icon: <InnerBlockCitationIcon />,
		selectors: {
			root: 'cite',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	paragraph: {
		name: 'core/paragraph',
		type: 'paragraph',
		label: __('Paragraphs', 'blockera-core'),
		icon: <InnerBlockParagraphIcon />,
		selectors: {
			root: 'p',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	link: {
		name: 'core/link',
		type: 'link',
		label: __('Links', 'blockera-core'),
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

export const Pullquote = {
	name: 'blockeraPullquote',
	targetBlock: 'core/pullquote',
	attributes,
	supports: {
		...IconExtensionSupports,
		...sharedBlockExtensionSupports,
	},
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
