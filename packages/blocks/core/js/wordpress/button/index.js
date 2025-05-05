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

export const Button: BlockType = {
	name: 'blockeraButton',
	targetBlock: 'core/button',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
	availableBlockStates: {
		...generalBlockStates,
		focus: {
			...generalBlockStates.focus,
			force: true,
		},
		active: {
			type: 'active',
			label: __('Active', 'blockera'),
			category: 'interactive-states',
			breakpoints: {},
			priority: 25,
			force: true,
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
};
