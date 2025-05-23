// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
/**
 * Internal dependencies
 */
import type { TStates, StateTypes } from './types';

const baseBlockStates = {
	normal: {
		type: 'normal',
		label: __('Normal', 'blockera'),
		category: 'essential',
		breakpoints: {},
		priority: 0,
		force: true,
		settings: {
			color: 'var(--blockera-controls-primary-color-bk)',
		},
	},
	hover: {
		type: 'hover',
		label: __('Hover', 'blockera'),
		category: 'interactive-states',
		tooltip: (
			<>
				<h5>{__('Hover State', 'blockera')}</h5>
				<p>
					{__(
						'Styles that apply while the pointer is over the block.',
						'blockera'
					)}
				</p>
				<code style={{ margin: '5px 0' }}>
					<span style={{ opacity: '0.7', marginRight: '1px' }}>
						.block
					</span>
					:hover
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
	focus: {
		type: 'focus',
		label: __('Focus', 'blockera'),
		category: 'interactive-states',
		tooltip: (
			<>
				<h5>{__('Focus State', 'blockera')}</h5>
				<p>
					{__(
						'Applies when the element gains keyboard or programmatic focus. Great for accessibility focus rings.',
						'blockera'
					)}
				</p>
				<code style={{ margin: '5px 0' }}>
					<span style={{ opacity: '0.7', marginRight: '1px' }}>
						.block
					</span>
					:focus
				</code>
			</>
		),
		breakpoints: {},
		native: true,
		priority: 10,
		force: false,
		settings: {
			color: 'var(--blockera-controls-states-color)',
		},
	},
	'focus-within': {
		type: 'focus-within',
		label: __('Focus Within', 'blockera'),
		category: 'interactive-states',
		tooltip: (
			<>
				<h5>{__('Focus Within State', 'blockera')}</h5>
				<p>
					{__(
						'Fires when any child inside the block is focused.',
						'blockera'
					)}
				</p>
				<code style={{ margin: '5px 0' }}>
					<span style={{ opacity: '0.7', marginRight: '1px' }}>
						.block
					</span>
					:focus-within
				</code>
			</>
		),
		breakpoints: {},
		native: true,
		priority: 20,
		force: false,
		settings: {
			color: 'var(--blockera-controls-states-color)',
		},
	},
	before: {
		type: 'before',
		label: __('Before', 'blockera'),
		category: 'content-inserts',
		tooltip: (
			<>
				<h5>{__('Before Pseudo-Elements', 'blockera')}</h5>
				<p>
					{__(
						'Creates an inline pseudo-element before the block content.',
						'blockera'
					)}
				</p>
				<code style={{ margin: '5px 0' }}>
					<span style={{ opacity: '0.7', marginRight: '1px' }}>
						.block
					</span>
					:before
				</code>
			</>
		),
		breakpoints: {},
		native: true,
		priority: 30,
		force: false,
		settings: {
			color: 'var(--blockera-controls-states-color)',
			hasContent: true,
		},
	},
	after: {
		type: 'after',
		label: __('After', 'blockera'),
		category: 'content-inserts',
		tooltip: (
			<>
				<h5>{__('After Pseudo-Elements', 'blockera')}</h5>
				<p>
					{__(
						'Creates an inline pseudo-element after the block content.',
						'blockera'
					)}
				</p>
				<code style={{ margin: '5px 0' }}>
					<span style={{ opacity: '0.7', marginRight: '1px' }}>
						.block
					</span>
					:after
				</code>
			</>
		),
		breakpoints: {},
		native: true,
		priority: 30,
		force: false,
		settings: {
			color: 'var(--blockera-controls-states-color)',
			hasContent: true,
		},
	},
	'first-child': {
		type: 'first-child',
		label: __('First Child', 'blockera'),
		category: 'structural-selectors',
		tooltip: (
			<>
				<h5>{__('First Child Selector', 'blockera')}</h5>
				<p>
					{__(
						'Activates when the block is the leading child in its parent.',
						'blockera'
					)}
				</p>
				<code style={{ margin: '5px 0' }}>
					<span style={{ opacity: '0.7', marginRight: '1px' }}>
						.block
					</span>
					:first-child
				</code>
			</>
		),
		breakpoints: {},
		native: true,
		priority: 30,
		force: false,
		settings: {
			color: 'var(--blockera-controls-states-color)',
		},
	},
	'last-child': {
		type: 'last-child',
		label: __('Last Child', 'blockera'),
		category: 'structural-selectors',
		tooltip: (
			<>
				<h5>{__('Last Child Selector', 'blockera')}</h5>
				<p>
					{__(
						'Activates when the block is the last child in its parent.',
						'blockera'
					)}
				</p>
				<code style={{ margin: '5px 0' }}>
					<span style={{ opacity: '0.7', marginRight: '1px' }}>
						.block
					</span>
					:last-child
				</code>
			</>
		),
		breakpoints: {},
		native: true,
		priority: 30,
		force: false,
		settings: {
			color: 'var(--blockera-controls-states-color)',
		},
	},
	'only-child': {
		type: 'only-child',
		label: __('Only Child', 'blockera'),
		category: 'structural-selectors',
		tooltip: (
			<>
				<h5>{__('Only Child Selector', 'blockera')}</h5>
				<p>
					{__(
						'Activates when the block is the only child in its parent.',
						'blockera'
					)}
				</p>
				<code style={{ margin: '5px 0' }}>
					<span style={{ opacity: '0.7', marginRight: '1px' }}>
						.block
					</span>
					:only-child
				</code>
			</>
		),
		breakpoints: {},
		native: true,
		priority: 30,
		force: false,
		settings: {
			color: 'var(--blockera-controls-states-color)',
		},
	},
	empty: {
		type: 'empty',
		label: __('Empty', 'blockera'),
		category: 'structural-selectors',
		tooltip: (
			<>
				<h5>{__('Empty Selector', 'blockera')}</h5>
				<p>
					{__(
						'Activates when the block has no children elements or content.',
						'blockera'
					)}
				</p>
				<code style={{ margin: '5px 0' }}>
					<span style={{ opacity: '0.7', marginRight: '1px' }}>
						.block
					</span>
					:empty
				</code>
			</>
		),
		breakpoints: {},
		native: true,
		priority: 30,
		force: false,
		settings: {
			color: 'var(--blockera-controls-states-color)',
		},
	},
};

const baseSharedBlockStates = {
	active: {
		type: 'active',
		label: __('Active', 'blockera'),
		category: 'interactive-states',
		tooltip: (
			<>
				<h5>{__('Active State', 'blockera')}</h5>
				<p>
					{__(
						'Applies while the block is being clicked or tapped.',
						'blockera'
					)}
				</p>
				<code style={{ margin: '5px 0' }}>
					<span style={{ opacity: '0.7', marginRight: '1px' }}>
						.block
					</span>
					:active
				</code>
			</>
		),
		breakpoints: {},
		native: true,
		priority: 25,
		force: false,
		settings: {
			color: 'var(--blockera-controls-states-color)',
		},
	},
	visited: {
		type: 'visited',
		label: __('Visited', 'blockera'),
		category: 'interactive-states',
		tooltip: (
			<>
				<h5>{__('Visited State', 'blockera')}</h5>
				<p>
					{__(
						'Activates if the block link has been visited.',
						'blockera'
					)}
				</p>
				<code style={{ margin: '5px 0' }}>
					<span style={{ opacity: '0.7', marginRight: '1px' }}>
						.block
					</span>
					:visited
				</code>
			</>
		),
		breakpoints: {},
		native: true,
		priority: 25,
		force: false,
		settings: {
			color: 'var(--blockera-controls-states-color)',
		},
	},
	marker: {
		type: 'marker',
		label: __('Marker', 'blockera'),
		category: 'content-inserts',
		tooltip: (
			<>
				<h5>{__('Marker Pseudo-Elements', 'blockera')}</h5>
				<p>
					{__(
						'Styles the marker generated by the browser for lists.',
						'blockera'
					)}
				</p>
				<code style={{ margin: '5px 0' }}>
					<span style={{ opacity: '0.7', marginRight: '1px' }}>
						.block
					</span>
					::marker
				</code>
			</>
		),
		breakpoints: {},
		native: true,
		priority: 35,
		force: false,
		settings: {
			color: 'var(--blockera-controls-states-color)',
			hasContent: true,
		},
	},
	placeholder: {
		type: 'placeholder',
		label: __('Placeholder', 'blockera'),
		category: 'content-inserts',
		tooltip: (
			<>
				<h5>{__('Placeholder Pseudo-Elements', 'blockera')}</h5>
				<p>
					{__(
						'Styles the placeholder text visible until content is entered.',
						'blockera'
					)}
				</p>
				<code style={{ margin: '5px 0' }}>
					<span style={{ opacity: '0.7', marginRight: '1px' }}>
						.block
					</span>
					::placeholder
				</code>
			</>
		),
		breakpoints: {},
		native: true,
		priority: 35,
		force: false,
		settings: {
			color: 'var(--blockera-controls-states-color)',
		},
	},
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
		native: true,
		priority: 10,
		force: false,
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
		native: true,
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
		native: true,
		priority: 10,
		force: false,
		settings: {
			color: 'var(--blockera-controls-states-color)',
		},
	},
};

export const generalBlockStates: { [key: TStates]: StateTypes } = applyFilters(
	'blockera.editor.extensions.blockStates.availableStates',
	baseBlockStates
);

export const generalInnerBlockStates: { [key: TStates]: StateTypes } =
	applyFilters(
		'blockera.editor.extensions.blockStates.availableInnerBlocksStates',
		baseBlockStates
	);

export const sharedBlockStates: { [key: TStates]: StateTypes } = applyFilters(
	'blockera.editor.extensions.blockStates.sharedAvailableStates',
	baseSharedBlockStates
);
