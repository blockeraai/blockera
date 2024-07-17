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

/**
 * Internal dependencies
 */
import link from '../inners/link';
import form from '../inners/form';
import inputs from '../inners/inputs';
import button from '../inners/button';
import headings from '../inners/headings';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

const blockeraInnerBlocks: InnerBlocks = {
	title: {
		name: 'elements/title',
		label: __('Title', 'blockera'),
		icon: <Icon icon="block-comments-form-reply-title" iconSize="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
	notes: {
		name: 'elements/notes',
		label: __('Notes', 'blockera'),
		icon: <Icon icon="block-comments-form-notes" iconSize="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
	textarea: {
		name: 'elements/textarea',
		label: __('Textarea Field', 'blockera'),
		icon: <Icon icon="block-comments-form-textarea" iconSize="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
	cookie_consent: {
		name: 'elements/cookie-consent',
		label: __('Cookie Consent', 'blockera'),
		icon: <Icon icon="block-comments-form-cookie-consent" iconSize="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
};

// We not needs to remember in post-comments-form block!
delete form?.remember;

export const PostCommentsFrom = {
	name: 'blockeraPostCommentsForm',
	targetBlock: 'core/post-comments-form',
	attributes,
	supports,
	blockeraInnerBlocks: {
		...form,
		...blockeraInnerBlocks,
		...button,
		...link,
		...headings,
	},
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
