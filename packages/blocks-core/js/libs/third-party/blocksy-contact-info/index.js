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
import type { BlockType } from '../../../type';

export const BlocksyContactInfo: BlockType = {
	name: 'blockeraBlocksyContactInfo',
	targetBlock: 'blocksy/contact-info',
	blockeraInnerBlocks: {
		'elements/icons': {
			name: 'elements/icons',
			label: __('Icons', 'blockera'),
			description: __(
				'Icon elements inside the contact info block.',
				'blockera'
			),
			icon: (
				<Icon icon="block-blocksy-contact-info-icons" iconSize="20" />
			),
			settings: {
				force: true,
			},
		},
		'elements/titles': {
			name: 'elements/titles',
			label: __('Titles', 'blockera'),
			description: __(
				'All title elements inside the contact info block.',
				'blockera'
			),
			icon: (
				<Icon icon="block-blocksy-contact-info-titles" iconSize="20" />
			),
			settings: {
				force: true,
			},
		},
		'elements/contents': {
			name: 'elements/contents',
			label: __('Contents', 'blockera'),
			description: __(
				'All content elements inside the contact info block.',
				'blockera'
			),
			icon: (
				<Icon
					icon="block-blocksy-contact-info-contents"
					iconSize="20"
				/>
			),
			settings: {
				force: true,
			},
		},
		'elements/text': {
			name: 'elements/text',
			label: __('All Texts', 'blockera'),
			description: __(
				'All text elements inside the contact info block.',
				'blockera'
			),
			icon: (
				<Icon icon="block-blocksy-contact-info-texts" iconSize="20" />
			),
			settings: {
				force: true,
			},
		},
		'elements/link': {
			name: 'elements/link',
			label: __('Links', 'blockera'),
			description: __(
				'All link elements inside the contact info block.',
				'blockera'
			),
			icon: <Icon icon="block-blocksy-contact-info-link" iconSize="20" />,
			settings: {
				force: true,
			},
			availableBlockStates: {
				...generalInnerBlockStates,
				focus: {
					...generalInnerBlockStates.focus,
					force: true,
				},
				active: {
					...sharedBlockStates.active,
					force: true,
				},
				visited: sharedBlockStates.visited,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
