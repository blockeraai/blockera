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
} from '@blockera/editor-extensions/js/libs';
import type { InnerBlocks } from '@blockera/editor-extensions/js/libs/inner-blocks/types';

/**
 * Internal dependencies
 */
import { InnerBlockFormContainerIcon } from './icons/inner-block-form-container';
import { InnerBlockFormInputLabelIcon } from './icons/inner-block-form-input-label';
import { InnerBlockFormInputFieldsIcon } from './icons/inner-block-form-input-fields';
import { InnerBlockFormButtonIcon } from './icons/inner-block-form-button';
import { InnerBlockFormRememberIcon } from './icons/inner-block-form-remember';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

const blockeraInnerBlocks: InnerBlocks = {
	form: {
		name: 'core/form',
		type: 'form',
		label: __('Form Container', 'blockera'),
		icon: <InnerBlockFormContainerIcon />,
		selectors: {
			root: 'form',
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
		icon: <InnerBlockFormInputLabelIcon />,
		selectors: {
			root: '.login-password label, .login-username label',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	input: {
		name: 'input',
		type: 'input',
		label: __('Inputs', 'blockera'),
		icon: <InnerBlockFormInputFieldsIcon />,
		selectors: {
			root: '.login-password input, .login-username input',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
	remember: {
		name: 'remember',
		type: 'remember',
		label: __('Remember Me', 'blockera'),
		icon: <InnerBlockFormRememberIcon />,
		selectors: {
			root: '.login-remember label',
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
		icon: <InnerBlockFormButtonIcon />,
		selectors: {
			root: '.button.button-primary',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
};

export const Loginout = {
	name: 'blockeraLoginout',
	targetBlock: 'core/loginout',
	attributes,
	supports,
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
