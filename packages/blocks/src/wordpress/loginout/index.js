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
} from '@publisher/extensions';
import type { InnerBlocks } from '@publisher/extensions/src/libs/inner-blocks/types';

/**
 * Internal dependencies
 */
import { InnerBlockFormContainerIcon } from './icons/inner-block-form-container';
import { InnerBlockFormInputLabelIcon } from './icons/inner-block-form-input-label';
import { InnerBlockFormInputFieldsIcon } from './icons/inner-block-form-input-fields';
import { InnerBlockFormButtonIcon } from './icons/inner-block-form-button';
import { InnerBlockFormRememberIcon } from './icons/inner-block-form-remember';

const attributes = {
	...IconExtensionAttributes,
	...sharedBlockExtensionAttributes,
};

const publisherInnerBlocks: InnerBlocks = {
	form: {
		name: 'core/form',
		type: 'form',
		label: __('Form Container', 'publisher-core'),
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
		label: __('Input Labels', 'publisher-core'),
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
		label: __('Inputs', 'publisher-core'),
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
		label: __('Remember Me', 'publisher-core'),
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
		label: __('Submit Button', 'publisher-core'),
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
	name: 'publisherLoginout',
	targetBlock: 'core/loginout',
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
