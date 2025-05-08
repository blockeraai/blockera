// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import {
	SharedBlockExtension,
	generalInnerBlockStates,
	sharedBlockStates,
} from '@blockera/editor';
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
			description: __('The login form container element.', 'blockera'),
			icon: <Icon icon="block-login-form-container" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/input-label': {
			name: 'elements/input-label',
			label: __('Input Label', 'blockera'),
			description: __('The input label elements.', 'blockera'),
			icon: <Icon icon="block-login-form-labels" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/input': {
			name: 'elements/input',
			label: __('Input', 'blockera'),
			description: __('The login form input elements.', 'blockera'),
			icon: <Icon icon="block-login-form-inputs" iconSize="20" />,
			settings: {
				force: true,
			},
			availableBlockStates: {
				...generalInnerBlockStates,
				focus: {
					...generalInnerBlockStates.focus,
					force: true,
				},
				placeholder: {
					...sharedBlockStates.placeholder,
					force: true,
				},
			},
		},
		'elements/remember': {
			name: 'elements/remember',
			label: __('Remember Me', 'blockera'),
			description: __(
				'The login form remember me checkbox element.',
				'blockera'
			),
			icon: <Icon icon="block-login-form-remember" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'core/button': {
			...sharedInnerBlocks['core/button'],
			description: __('The login form submit button.', 'blockera'),
			settings: {
				...sharedInnerBlocks['core/button'].settings,
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
