// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const TagCloud: BlockType = {
	name: 'blockeraTagCloud',
	targetBlock: 'core/tag-cloud',
	blockeraInnerBlocks: {
		'elements/tag-link': {
			name: 'elements/tag-link',
			type: 'title',
			label: __('Tag Link', 'blockera'),
			description: __('All tag items inside tag cloud.', 'blockera'),
			icon: <Icon icon="tag" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
