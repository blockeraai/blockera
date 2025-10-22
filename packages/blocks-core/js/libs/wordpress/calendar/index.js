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
import type { BlockType } from '../../type';

export const Calendar: BlockType = {
	name: 'blockeraCalendar',
	targetBlock: 'core/calendar',
	blockeraInnerBlocks: {
		'elements/caption': {
			name: 'elements/caption',
			label: __('Caption', 'blockera'),
			description: __('Caption element of the calendar.', 'blockera'),
			icon: <Icon icon="target" iconSize="20" />,
			settings: {
				force: true,
				priority: 10,
			},
		},
		'elements/thead': {
			name: 'elements/thead',
			label: __('Header', 'blockera'),
			description: __(
				'Header container element of the calendar.',
				'blockera'
			),
			icon: <Icon icon="target" iconSize="20" />,
			settings: {
				force: false,
				priority: 10,
			},
		},
		'elements/thead-cells': {
			name: 'elements/thead-cells',
			label: __('Header → Cells', 'blockera'),
			description: __('Header cells of the calendar.', 'blockera'),
			icon: <Icon icon="target" iconSize="20" />,
			settings: {
				force: true,
				priority: 10,
			},
		},
		'elements/tbody': {
			name: 'elements/tbody',
			label: __('Body', 'blockera'),
			description: __(
				'Body container element of the calendar.',
				'blockera'
			),
			icon: <Icon icon="target" iconSize="20" />,
			settings: {
				force: false,
				priority: 10,
			},
		},
		'elements/tbody-cells': {
			name: 'elements/tbody-cells',
			label: __('Body → Cells', 'blockera'),
			description: __('Body cells of the calendar.', 'blockera'),
			icon: <Icon icon="target" iconSize="20" />,
			settings: {
				force: true,
				priority: 10,
			},
		},
		'elements/tbody-empty-cells': {
			name: 'elements/tbody-empty-cells',
			label: __('Body → Empty Cells', 'blockera'),
			description: __(
				'Empty cells in the body of the calendar.',
				'blockera'
			),
			icon: <Icon icon="target" iconSize="20" />,
			settings: {
				force: false,
				priority: 10,
			},
		},
		'elements/navigation-item': {
			name: 'elements/navigation-item',
			label: __('Next/Prev Links', 'blockera'),
			description: __(
				'Next/Prev navigation links of the calendar.',
				'blockera'
			),
			icon: <Icon icon="target" iconSize="20" />,
			settings: {
				force: true,
				priority: 10,
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
