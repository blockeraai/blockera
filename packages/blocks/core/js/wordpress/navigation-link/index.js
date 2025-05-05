// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension, generalBlockStates } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';
import sharedInnerBlocks from '../inners/shared';

export const NavigationLink: BlockType = {
	name: 'blockeraNavigationLink',
	targetBlock: 'core/navigation-link',
	blockeraInnerBlocks: {
		'elements/link': sharedInnerBlocks['elements/link'],
	},
	availableBlockStates: {
		...generalBlockStates,
		'current-page': {
			type: 'current-page',
			label: __('Is Current Page', 'blockera'),
			category: 'special',
			breakpoints: {},
			priority: 10,
			force: true,
			settings: {
				color: 'var(--blockera-controls-states-color)',
			},
		},
		active: {
			type: 'active',
			label: __('Active', 'blockera'),
			category: 'interactive-states',
			breakpoints: {},
			priority: 25,
			force: false,
			settings: {
				color: 'var(--blockera-controls-states-color)',
			},
		},
		visited: {
			type: 'visited',
			label: __('Visited', 'blockera'),
			category: 'interactive-states',
			breakpoints: {},
			priority: 25,
			force: false,
			settings: {
				color: 'var(--blockera-controls-states-color)',
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
