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
	form: {
		name: 'core/form',
		type: 'form',
		label: __('Form Container', 'blockera'),
		icon: <Icon icon="block-login-form-container" iconSize="20" />,
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
		icon: <Icon icon="block-login-form-labels" iconSize="20" />,
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
		icon: <Icon icon="block-login-form-inputs" iconSize="20" />,
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
		icon: <Icon icon="block-login-form-remember" iconSize="20" />,
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
		icon: <Icon icon="block-login-form-button" iconSize="20" />,
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
