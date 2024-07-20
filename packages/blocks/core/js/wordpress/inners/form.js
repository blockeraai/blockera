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

/**
 * Internal dependencies
 */
import inputs from './inputs';
import button from './button';

const attributes = sharedBlockExtensionAttributes;

const form: InnerBlocks = {
	'elements/form': {
		name: 'elements/form',
		label: __('Form Container', 'blockera'),
		icon: <Icon icon="block-login-form-container" iconSize="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
};

export default {
	...form,
	...inputs,
	...button,
};
