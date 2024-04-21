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
	InnerBlockButtonIcon,
	InnerBlockInputIcon,
	InnerBlockLinkIcon,
	InnerBlockHeadingsIcon,
	InnerBlockHeading1Icon,
	InnerBlockHeading2Icon,
	InnerBlockHeading3Icon,
	InnerBlockHeading4Icon,
	InnerBlockHeading5Icon,
	InnerBlockHeading6Icon,
} from '@blockera/extensions';
import type { InnerBlocks } from '@blockera/extensions/src/libs/inner-blocks/types';

/**
 * Internal dependencies
 */
import { InnerBlockFormContainerIcon } from './icons/inner-block-form-container';
import { InnerBlockFormReplyTitleIcon } from './icons/inner-block-form-reply-title';
import { InnerBlockFormNotesIcon } from './icons/inner-block-form-notes';
import { InnerBlockFormInputLabelIcon } from './icons/inner-block-form-input-label';
import { InnerBlockFormInputFieldsIcon } from './icons/inner-block-form-input-fields';
import { InnerBlockFormTextareaIcon } from './icons/inner-block-form-textarea';
import { InnerBlockFormCookieConsentIcon } from './icons/inner-block-form-cookie-consent';
import { InnerBlockFormButtonIcon } from './icons/inner-block-form-button';

const attributes = {
	...IconExtensionAttributes,
	...sharedBlockExtensionAttributes,
};

const blockeraInnerBlocks: InnerBlocks = {
	title: {
		name: 'core/title',
		type: 'title',
		label: __('Title', 'blockera-core'),
		icon: <InnerBlockFormReplyTitleIcon />,
		selectors: {
			root: '.comment-reply-title',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	form: {
		name: 'core/form',
		type: 'form',
		label: __('Form Container', 'blockera-core'),
		icon: <InnerBlockFormContainerIcon />,
		selectors: {
			root: '.comment-form',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	notes: {
		name: 'core/notes',
		type: 'notes',
		label: __('Notes', 'blockera-core'),
		icon: <InnerBlockFormNotesIcon />,
		selectors: {
			root: '.comment-notes',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	input_label: {
		name: 'input_label',
		type: 'input_label',
		label: __('Input Labels', 'blockera-core'),
		icon: <InnerBlockFormInputLabelIcon />,
		selectors: {
			root: 'label',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	input: {
		name: 'input',
		type: 'input',
		label: __('Input Fields', 'blockera-core'),
		icon: <InnerBlockFormInputFieldsIcon />,
		selectors: {
			root: '.wp-block-search__input',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	textarea: {
		name: 'textarea',
		type: 'textarea',
		label: __('Textarea Field', 'blockera-core'),
		icon: <InnerBlockFormTextareaIcon />,
		selectors: {
			root: 'textarea',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	cookie_consent: {
		name: 'cookie_consent',
		type: 'cookie_consent',
		label: __('Cookie Consent', 'blockera-core'),
		icon: <InnerBlockFormCookieConsentIcon />,
		selectors: {
			root: '.comment-form-cookies-consent',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	button: {
		name: 'core/button',
		type: 'button',
		label: __('Submit Button', 'blockera-core'),
		icon: <InnerBlockFormButtonIcon />,
		selectors: {
			root: 'input[type=submit]',
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
			force: false,
			dataCompatibility: ['font-color', 'font-color-hover'],
		},
	},
	heading: {
		name: 'core/heading',
		type: 'heading',
		label: __('Headings', 'blockera-core'),
		icon: <InnerBlockHeadingsIcon />,
		selectors: {
			root: 'h1.wp-block-heading, h2.wp-block-heading, h3.wp-block-heading, h4.wp-block-heading, h5.wp-block-heading, h6.wp-block-heading',
		},
		attributes,
		innerBlockSettings: {
			force: false,
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
	heading1: {
		name: 'core/h1',
		type: 'h1',
		label: __('H1s', 'blockera-core'),
		icon: <InnerBlockHeading1Icon />,
		selectors: {
			root: 'h1.wp-block-heading',
		},
		attributes,
		innerBlockSettings: {
			force: false,
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
	heading2: {
		name: 'core/h2',
		type: 'h2',
		label: __('H2s', 'blockera-core'),
		icon: <InnerBlockHeading2Icon />,
		selectors: {
			root: 'h2.wp-block-heading',
		},
		attributes,
		innerBlockSettings: {
			force: false,
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
	heading3: {
		name: 'core/h3',
		type: 'h3',
		label: __('H3s', 'blockera-core'),
		icon: <InnerBlockHeading3Icon />,
		selectors: {
			root: 'h3.wp-block-heading',
		},
		attributes,
		innerBlockSettings: {
			force: false,
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
	heading4: {
		name: 'core/h4',
		type: 'h4',
		label: __('H4s', 'blockera-core'),
		icon: <InnerBlockHeading4Icon />,
		selectors: {
			root: 'h4.wp-block-heading',
		},
		attributes,
		innerBlockSettings: {
			force: false,
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
	heading5: {
		name: 'core/h5',
		type: 'h5',
		label: __('H5s', 'blockera-core'),
		icon: <InnerBlockHeading5Icon />,
		selectors: {
			root: 'h5.wp-block-heading',
		},
		attributes,
		innerBlockSettings: {
			force: false,
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
	heading6: {
		name: 'core/h6',
		type: 'h6',
		label: __('H6s', 'blockera-core'),
		icon: <InnerBlockHeading6Icon />,
		selectors: {
			root: 'h6.wp-block-heading',
		},
		attributes,
		innerBlockSettings: {
			force: false,
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
};

export const PostCommentsFrom = {
	name: 'blockeraPostCommentsForm',
	targetBlock: 'core/post-comments-form',
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
