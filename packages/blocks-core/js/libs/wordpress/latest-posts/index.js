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

export const LatestPosts: BlockType = {
	name: 'blockeraLatestPosts',
	targetBlock: 'core/latest-posts',
	blockeraInnerBlocks: {
		'elements/link': {
			...sharedInnerBlocks['elements/link'],
			label: __('Post Links', 'blockera'),
			description: __('The post link elements.', 'blockera'),
			settings: {
				...sharedInnerBlocks['elements/link'].settings,
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
