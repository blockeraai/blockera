// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../type';

export const Loginout: BlockType = {
	name: 'blockeraLoginout',
	targetBlock: 'core/loginout',
	blockeraInnerBlocks: {
		'elements/form': {
			name: 'elements/form',
			label: __('Form Container', 'blockera'),
			icon: <Icon icon="block-login-form-container" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/input-label': {
			name: 'elements/input-label',
			label: __('Input Label', 'blockera'),
			icon: <Icon icon="block-login-form-labels" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/input': {
			name: 'elements/input',
			label: __('Input', 'blockera'),
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
		'core/button': sharedInnerBlocks['core/button'],
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
