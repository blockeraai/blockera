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

const states: { [key: TStates]: StateTypes } = applyFilters(
	'blockera.editor.extensions.blockStates.availableStates',
	{
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
			breakpoints: {},
			native: true,
			priority: 30,
			force: false,
			settings: {
				color: 'var(--blockera-controls-states-color)',
			},
		},
		after: {
			type: 'after',
			label: __('After', 'blockera'),
			category: 'content-inserts',
			breakpoints: {},
			native: true,
			priority: 30,
			force: false,
			settings: {
				color: 'var(--blockera-controls-states-color)',
			},
		},
		'first-child': {
			type: 'first-child',
			label: __('First Child', 'blockera'),
			category: 'structural-selectors',
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
			breakpoints: {},
			native: true,
			priority: 30,
			force: false,
			settings: {
				color: 'var(--blockera-controls-states-color)',
			},
		},
	}
);

export default states;
