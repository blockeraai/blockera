// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { TStates, StateTypes } from './types';

const states: { [key: TStates]: StateTypes } = {
	normal: {
		type: 'normal',
		label: __('Normal', 'blockera'),
		category: 'essential',
		categoryLabel: __('Essential', 'blockera'),
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
		category: 'essential',
		categoryLabel: __('Essential', 'blockera'),
		breakpoints: {},
		priority: 0,
		force: true,
		settings: {
			color: 'var(--blockera-controls-states-color)',
		},
	},
	before: {
		type: 'before',
		label: __('Before', 'blockera'),
		category: 'pseudo-classes',
		categoryLabel: __('Pseudo-classes', 'blockera'),
		breakpoints: {},
		native: true,
		priority: 10,
		force: false,
		settings: {
			color: 'var(--blockera-controls-states-color)',
		},
	},
	after: {
		type: 'after',
		label: __('After', 'blockera'),
		category: 'pseudo-classes',
		categoryLabel: __('Pseudo-classes', 'blockera'),
		breakpoints: {},
		native: true,
		priority: 10,
		force: false,
		settings: {
			color: 'var(--blockera-controls-states-color)',
		},
	},
	empty: {
		type: 'empty',
		label: __('Empty', 'blockera'),
		category: 'pseudo-classes',
		categoryLabel: __('Pseudo-classes', 'blockera'),
		breakpoints: {},
		native: true,
		priority: 10,
		force: false,
		settings: {
			color: 'var(--blockera-controls-states-color)',
		},
	},
	'custom-class': {
		type: 'custom-class',
		label: __('Custom Class', 'blockera'),
		category: 'advanced',
		categoryLabel: __('Advanced', 'blockera'),
		breakpoints: {},
		native: true,
		priority: 10,
		force: false,
		settings: {
			color: 'var(--blockera-controls-states-color)',
		},
	},
};

export default states;
