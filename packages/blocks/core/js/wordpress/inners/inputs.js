// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { sharedBlockExtensionAttributes } from '@blockera/editor';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';

const attributes = sharedBlockExtensionAttributes;

const inputs: InnerBlocks = {
	input_label: {
		name: 'elements/input-label',
		label: __('Input Labels', 'blockera'),
		icon: <Icon icon="block-login-form-labels" iconSize="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
	input: {
		name: 'elements/input',
		label: __('Inputs', 'blockera'),
		icon: <Icon icon="block-login-form-inputs" iconSize="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
	remember: {
		name: 'elements/remember',
		label: __('Remember Me', 'blockera'),
		icon: <Icon icon="block-login-form-remember" iconSize="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
};

export default inputs;
