// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../../type';

export const Buttons: BlockType = {
	name: 'blockeraButtons',
	targetBlock: 'core/buttons',
	blockeraInnerBlocks: {
		'core/button': {
			...sharedInnerBlocks['core/button'],
			label: __('Single Button', 'blockera'),
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
