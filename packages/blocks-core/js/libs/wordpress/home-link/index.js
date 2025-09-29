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

export const HomeLink: BlockType = {
	name: 'blockeraHomeLink',
	targetBlock: 'core/home-link',
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
		active: sharedBlockStates.active,
		visited: sharedBlockStates.visited,
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
	selectors: {
		'blockera/elements/icon': {
			root: '.wp-block-home-link__label:before,.wp-block-home-link__label:after',
		},
	},
};
