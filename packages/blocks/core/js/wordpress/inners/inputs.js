// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';

const inputs: InnerBlocks = {
	'elements/input-label': {
		name: 'elements/input-label',
		label: __('Input Labels', 'blockera'),
		icon: <Icon icon="block-login-form-labels" iconSize="20" />,
		settings: {
			force: true,
		},
	},
	'elements/input': {
		name: 'elements/input',
		label: __('Inputs', 'blockera'),
		icon: <Icon icon="block-login-form-inputs" iconSize="20" />,
		settings: {
			force: true,
		},
	},
	'elements/remember': {
		name: 'elements/remember',
		label: __('Remember Me', 'blockera'),
		icon: <Icon icon="block-login-form-remember" iconSize="20" />,
		settings: {
			force: true,
		},
	},
};

export default inputs;
