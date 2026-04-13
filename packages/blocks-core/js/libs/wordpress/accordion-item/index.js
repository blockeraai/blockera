// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import {
	generalBlockStates,
	sharedBlockStates,
	generalInnerBlockStates,
	SharedBlockExtension,
} from '@blockera/editor';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../../type';

export const AccordionItem: BlockType = {
	name: 'blockeraAccordionItem',
	targetBlock: 'core/accordion-item',
	blockeraInnerBlocks: {
		'elements/heading': {
			name: 'elements/heading',
			label: __('Heading', 'blockera'),
			description: __('The heading of accordion items.', 'blockera'),
			icon: <Icon icon="block-accordion-heading" iconSize="20" />,
			settings: {
				force: true,
				priority: 0,
			},
		},
		'elements/icon': {
			name: 'elements/icon',
			label: __('Icon', 'blockera'),
			description: __('Plus icon of accordion items.', 'blockera'),
			icon: <Icon icon="block-accordion-icon" iconSize="20" />,
			settings: {
				force: true,
				priority: 0,
			},
		},
		'elements/panel': {
			name: 'elements/panel',
			label: __('Panel', 'blockera'),
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
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
