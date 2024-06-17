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
	title: {
		name: 'core/title',
		type: 'title',
		label: __('Title', 'blockera'),
		icon: <Icon icon="block-comments-form-reply-title" iconSize="20" />,
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
		label: __('Form Container', 'blockera'),
		icon: <Icon icon="block-comments-form-container" iconSize="20" />,
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
		label: __('Notes', 'blockera'),
		icon: <Icon icon="block-comments-form-notes" iconSize="20" />,
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
		label: __('Input Labels', 'blockera'),
		icon: <Icon icon="block-comments-form-labels" iconSize="20" />,
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
		label: __('Input Fields', 'blockera'),
		icon: <Icon icon="block-comments-form-inputs" iconSize="20" />,
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
		label: __('Textarea Field', 'blockera'),
		icon: <Icon icon="block-comments-form-textarea" iconSize="20" />,
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
		label: __('Cookie Consent', 'blockera'),
		icon: <Icon icon="block-comments-form-cookie-consent" iconSize="20" />,
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
		label: __('Submit Button', 'blockera'),
		icon: <Icon icon="block-comments-form-button" iconSize="20" />,
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
		label: __('Links', 'blockera'),
		icon: <Icon icon="block-link" iconSize="20" />,
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
		label: __('Headings', 'blockera'),
		icon: <Icon icon="block-headings" iconSize="20" />,
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
		label: __('H1s', 'blockera'),
		icon: <Icon icon="block-heading-1" iconSize="20" />,
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
		label: __('H2s', 'blockera'),
		icon: <Icon icon="block-heading-2" iconSize="20" />,
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
		label: __('H3s', 'blockera'),
		icon: <Icon icon="block-heading-3" iconSize="20" />,
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
		label: __('H4s', 'blockera'),
		icon: <Icon icon="block-heading-4" iconSize="20" />,
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
		label: __('H5s', 'blockera'),
		icon: <Icon icon="block-heading-5" iconSize="20" />,
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
		label: __('H6s', 'blockera'),
		icon: <Icon icon="block-heading-6" iconSize="20" />,
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
	supports,
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
