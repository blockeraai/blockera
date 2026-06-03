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
import type { BlockType } from '../../../type';

export const Breadcrumbs: BlockType = {
	name: 'blockeraBreadcrumbs',
	targetBlock: 'core/breadcrumbs',
	blockeraInnerBlocks: {
		'elements/trail-item': {
			...sharedInnerBlocks['elements/link'],
			name: 'elements/trail-item',
			label: __('Trail Items', 'blockera'),
			description: __(
				'All breadcrumb trail items, including links and plain text.',
				'blockera'
			),
			icon: <Icon icon="block-breadcrumbs-trail-items" iconSize="20" />,
			settings: {
				...sharedInnerBlocks['elements/link'].settings,
				force: true,
			},
		},
		'elements/current-trail-item': {
			name: 'elements/current-trail-item',
			label: __('Current Trail Item', 'blockera'),
			description: __(
				'The current page breadcrumb item only.',
				'blockera'
			),
			icon: <Icon icon="block-breadcrumbs-current-item" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/separator': {
			name: 'elements/separator',
			label: __('Separators', 'blockera'),
			description: __(
				'The breadcrumb separators between trail items.',
				'blockera'
			),
			icon: <Icon icon="block-breadcrumbs-separator" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
