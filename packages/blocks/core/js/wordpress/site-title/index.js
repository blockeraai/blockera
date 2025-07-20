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
import type { BlockType } from '../../type';

export const SiteTitle: BlockType = {
	name: 'blockeraSiteTitle',
	targetBlock: 'core/site-title',
	blockeraInnerBlocks: {
		'elements/link': {
			...sharedInnerBlocks['elements/link'],
			label: __('Link', 'blockera'),
			description: __('The hyperlink element.', 'blockera'),
			settings: {
				...sharedInnerBlocks['elements/link'].settings,
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
	blockFeatures: {
		icon: {
			htmlEditable: {
				status: true,
				selector: '{{ BLOCK_SELECTOR }} a',
			},
		},
	},
};
