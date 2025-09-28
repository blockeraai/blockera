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

export const BlocksyBreadcrumbs: BlockType = {
	name: 'blockeraBlocksyBreadcrumbs',
	targetBlock: 'blocksy/breadcrumbs',
	blockeraInnerBlocks: {
		'elements/links': {
			name: 'elements/links',
			label: __('Links', 'blockera'),
			description: __('The breadcrumb link elements.', 'blockera'),
			icon: <Icon icon="breadcrumb-links" iconSize="20" />,
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
		'elements/separator': {
			name: 'elements/separator',
			label: __('Separator', 'blockera'),
			description: __(
				'The breadcrumb separator icon element.',
				'blockera'
			),
			icon: <Icon icon="breadcrumb-separator" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/text': {
			name: 'elements/text',
			label: __('Text', 'blockera'),
			description: __('The breadcrumb text element.', 'blockera'),
			icon: <Icon icon="breadcrumb-text" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
