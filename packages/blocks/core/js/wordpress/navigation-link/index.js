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
			type: 'current-menu-item',
			label: __('Current Page', 'blockera'),
			category: 'special',
			tooltip: (
				<>
					<h5>{__('Is Current Page?', 'blockera')}</h5>
					<p>
						{__(
							'Activates if the block URL is the same as the current page.',
							'blockera'
						)}
					</p>
					<code style={{ margin: '5px 0' }}>
						<span style={{ opacity: '0.7' }}>.block</span>
						.current-menu-item
					</code>
				</>
			),
			breakpoints: {},
			priority: 10,
			force: true,
			settings: {
				color: 'var(--blockera-controls-states-color)',
			},
		},
		'current-menu-parent': {
			type: 'current-menu-parent',
			label: __('Current Page Parent', 'blockera'),
			category: 'special',
			tooltip: (
				<>
					<h5>{__('Is Current Page Parent?', 'blockera')}</h5>
					<p>
						{__(
							'Indicates that one of this item’s direct descendants is the current page.',
							'blockera'
						)}
					</p>
					<code style={{ margin: '5px 0' }}>
						<span style={{ opacity: '0.7' }}>.block</span>
						.current-menu-parent
					</code>
				</>
			),
			breakpoints: {},
			priority: 10,
			force: false,
			settings: {
				color: 'var(--blockera-controls-states-color)',
			},
		},
		'current-menu-ancestor': {
			type: 'current-menu-ancestor',
			label: __('Current Page Ancestor', 'blockera'),
			category: 'special',
			tooltip: (
				<>
					<h5>{__('Is Current Page Ancestor?', 'blockera')}</h5>
					<p>
						{__(
							'Indicates that one of this item’s descendants is the current page.',
							'blockera'
						)}
					</p>
					<code style={{ margin: '5px 0' }}>
						<span style={{ opacity: '0.7' }}>.block</span>
						.current-menu-ancestor
					</code>
				</>
			),
			breakpoints: {},
			priority: 10,
			force: false,
			settings: {
				color: 'var(--blockera-controls-states-color)',
			},
		},
		active: sharedBlockStates.active,
		visited: sharedBlockStates.visited,
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
