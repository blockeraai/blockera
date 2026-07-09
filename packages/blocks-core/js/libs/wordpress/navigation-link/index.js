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
	generalBlockStates,
	sharedBlockStates,
} from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';
import sharedInnerBlocks from '../inners/shared';

export const NavigationLink: BlockType = {
	name: 'blockeraNavigationLink',
	targetBlock: 'core/navigation-link',
	blockeraInnerBlocks: {
		'elements/link': {
			...sharedInnerBlocks['elements/link'],
			label: __('Link', 'blockera'),
			description: __('Hyperlink element.', 'blockera'),
		},
	},
	availableBlockStates: {
		...generalBlockStates,
		'current-menu-item': {
			...sharedBlockStates['current-menu-item'],
			force: true,
		},
		'current-menu-parent': sharedBlockStates['current-menu-parent'],
		'current-menu-ancestor': sharedBlockStates['current-menu-ancestor'],
		active: sharedBlockStates.active,
		visited: sharedBlockStates.visited,
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
	selectors: {
		'blockera/elements/icon': {
			root: '.wp-block-navigation-item__content .wp-block-navigation-item__label:before,.wp-block-navigation-item__content .wp-block-navigation-item__label:after',
		},
	},
};
