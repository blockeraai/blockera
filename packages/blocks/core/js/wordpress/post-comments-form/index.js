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

export const PostCommentsFrom: BlockType = {
	name: 'blockeraPostCommentsForm',
	targetBlock: 'core/post-comments-form',
	blockeraInnerBlocks: {
		'elements/form': {
			name: 'elements/form',
			label: __('Form Container', 'blockera'),
			icon: <Icon icon="block-login-form-container" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/title': {
			name: 'elements/title',
			label: __('Form Title', 'blockera'),
			icon: <Icon icon="block-comments-form-reply-title" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/notes': {
			name: 'elements/notes',
			label: __('Form Notes', 'blockera'),
			icon: <Icon icon="block-comments-form-notes" iconSize="20" />,
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
			label: __('Input Field', 'blockera'),
			icon: <Icon icon="block-login-form-inputs" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/textarea': {
			name: 'elements/textarea',
			label: __('Textarea Field', 'blockera'),
			icon: <Icon icon="block-comments-form-textarea" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/cookie-consent': {
			name: 'elements/cookie-consent',
			label: __('Cookie Consent', 'blockera'),
			icon: (
				<Icon icon="block-comments-form-cookie-consent" iconSize="20" />
			),
			settings: {
				force: true,
			},
		},
		'core/button': {
			name: 'core/button',
			label: __('Form Button', 'blockera'),
			icon: <Icon icon="button" library="wp" iconSize="20" />,
			settings: {
				force: true,
				dataCompatibility: [
					'font-color',
					'background-color',
					'background-image',
				],
			},
		},
		'core/heading': sharedInnerBlocks['core/heading'],
		'elements/link': sharedInnerBlocks['elements/link'],
		'core/heading-1': sharedInnerBlocks['core/heading-1'],
		'core/heading-2': sharedInnerBlocks['core/heading-2'],
		'core/heading-3': sharedInnerBlocks['core/heading-3'],
		'core/heading-4': sharedInnerBlocks['core/heading-4'],
		'core/heading-5': sharedInnerBlocks['core/heading-5'],
		'core/heading-6': sharedInnerBlocks['core/heading-6'],
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
