// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import {
	generalInnerBlockStates,
	SharedBlockExtension,
} from '@blockera/editor';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const Accordion: BlockType = {
	name: 'blockeraAccordion',
	targetBlock: 'core/accordion',
	blockeraInnerBlocks: {
		'elements/items': {
			name: 'elements/items',
			label: __('Items', 'blockera'),
			description: __(
				'The accordion items of accordion block.',
				'blockera'
			),
			icon: <Icon icon="block-accordion-items" iconSize="20" />,
			settings: {
				force: true,
				priority: 0,
			},
			availableBlockStates: {
				...generalInnerBlockStates,
				open: {
					type: 'open',
					label: __('Open', 'blockera'),
					category: 'special',
					tooltip: (
						<>
							<h5>{__('Open State', 'blockera')}</h5>
							<p>
								{__(
									'Styles that apply when the accordion item is expanded.',
									'blockera'
								)}
							</p>
							<code style={{ margin: '5px 0' }}>
								<span
									style={{
										opacity: '0.7',
										marginRight: '1px',
									}}
								>
									.block
								</span>
								.is-open
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
				close: {
					type: 'close',
					label: __('Close', 'blockera'),
					category: 'special',
					tooltip: (
						<>
							<h5>{__('Close State', 'blockera')}</h5>
							<p>
								{__(
									'Styles that apply when the accordion item is collapsed.',
									'blockera'
								)}
							</p>
							<code style={{ margin: '5px 0' }}>
								<span
									style={{
										opacity: '0.7',
										marginRight: '1px',
									}}
								>
									.block
								</span>
								:not(.is-open)
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
		},
		'elements/heading': {
			name: 'elements/heading',
			label: __('Headings', 'blockera'),
			description: __('The heading of accordion items.', 'blockera'),
			icon: <Icon icon="block-accordion-heading" iconSize="20" />,
			settings: {
				force: true,
				priority: 0,
			},
		},
		'elements/icon': {
			name: 'elements/icon',
			label: __('Icons', 'blockera'),
			description: __('Plus icon of accordion items.', 'blockera'),
			icon: <Icon icon="block-accordion-icon" iconSize="20" />,
			settings: {
				force: true,
				priority: 0,
			},
		},
		'elements/panel': {
			name: 'elements/panel',
			label: __('Panels', 'blockera'),
			description: __(
				'The content panel of accordion items.',
				'blockera'
			),
			icon: <Icon icon="block-accordion-panel" iconSize="20" />,
			settings: {
				force: true,
				priority: 0,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
