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
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../type';

export const PostNavigationLink: BlockType = {
	name: 'blockeraPostNavigationLink',
	targetBlock: 'core/post-navigation-link',
	blockeraInnerBlocks: {
		'elements/arrow': {
			name: 'elements/arrow',
			type: 'title',
			label: __('Arrow', 'blockera'),
			description: __('Arrow icon element.', 'blockera'),
			icon: <Icon icon="previous" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/link': {
			...sharedInnerBlocks['elements/link'],
			label: __('Link', 'blockera'),
			description: __('Hyperlink element.', 'blockera'),
			settings: {
				...sharedInnerBlocks['elements/link'].settings,
				force: false,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
