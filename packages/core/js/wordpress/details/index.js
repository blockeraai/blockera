// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { generalBlockStates, SharedBlockExtension } from '@blockera/editor';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../type';

export const Details: BlockType = {
	name: 'blockeraDetails',
	targetBlock: 'core/details',
	blockeraInnerBlocks: {
		'elements/title': {
			name: 'elements/title',
			type: 'title',
			label: __('Title', 'blockera'),
			description: __('The title of details block.', 'blockera'),
			icon: <Icon icon="block-details-title" iconSize="20" />,
			settings: {
				force: true,
				priority: 0,
			},
		},
		'elements/title-icon': {
			name: 'elements/title-icon',
			type: 'title',
			label: __('Arrow', 'blockera'),
			description: __('Chevron down icon of title.', 'blockera'),
			icon: <Icon icon="block-details-arrow" iconSize="20" />,
			settings: {
				force: true,
				priority: 0,
			},
		},
		'elements/paragraph': {
			...sharedInnerBlocks['core/paragraph'],
			icon: <Icon icon="block-details-paragraph" iconSize="20" />,
			settings: {
				...sharedInnerBlocks['core/paragraph'].settings,
				force: true,
			},
		},
		'elements/link': sharedInnerBlocks['elements/link'],
	},
	availableBlockStates: {
		...generalBlockStates,
		open: {
			type: 'open',
			label: __('Open', 'blockera'),
			category: 'special',
			tooltip: (
				<>
					<h5>{__('Open State', 'blockera')}</h5>
					<p>
						{__(
							'Styles that apply when the details block is open and expanded.',
							'blockera'
						)}
					</p>
					<code style={{ margin: '5px 0' }}>
						<span style={{ opacity: '0.7', marginRight: '1px' }}>
							.block
						</span>
						[open]
					</code>
				</>
			),
			breakpoints: {},
			priority: 0,
			force: true,
			settings: {
				color: 'var(--blockera-controls-states-color)',
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
