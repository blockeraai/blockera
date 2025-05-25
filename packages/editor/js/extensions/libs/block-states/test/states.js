//@flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { TStatesLabel } from '../types';
import { applyFilters } from '@wordpress/hooks';

export type BlockStateType = {
	type: string,
	label: TStatesLabel,
	breakpoints: Object,
	disabled?: boolean,
};

const sharedBlockStates: {
	[key: string]: BlockStateType,
} = applyFilters('blockera.editor.extensions.blockStates.availableStates', {
	normal: {
		type: 'normal',
		label: 'Normal',
		breakpoints: {},
	},
	hover: {
		type: 'hover',
		label: 'Hover',
		breakpoints: {},
	},
	active: {
		type: 'active',
		label:
			__('Active', 'blockera') + ' - ' + __('Upgrade to RPO', 'blockera'),
		breakpoints: {},
		disabled: true,
	},
	focus: {
		type: 'focus',
		label:
			__('Focus', 'blockera') + ' - ' + __('Upgrade to RPO', 'blockera'),
		breakpoints: {},
		disabled: true,
	},
	visited: {
		type: 'visited',
		label:
			__('Visited', 'blockera') +
			' - ' +
			__('Upgrade to RPO', 'blockera'),
		breakpoints: {},
		disabled: true,
	},
	before: {
		type: 'before',
		label:
			__('Before', 'blockera') + ' - ' + __('Upgrade to RPO', 'blockera'),
		breakpoints: {},
		disabled: true,
	},
	after: {
		type: 'after',
		label:
			__('After', 'blockera') + ' - ' + __('Upgrade to RPO', 'blockera'),
		breakpoints: {},
		disabled: true,
	},
	'custom-class': {
		type: 'custom-class',
		label:
			__('Custom Class', 'blockera') +
			' - ' +
			__('Upgrade to RPO', 'blockera'),
		breakpoints: {},
		disabled: true,
	},
	'parent-class': {
		type: 'parent-class',
		label:
			__('Parent Class', 'blockera') +
			' - ' +
			__('Upgrade to RPO', 'blockera'),
		breakpoints: {},
		disabled: true,
	},
	'parent-hover': {
		type: 'parent-hover',
		label:
			__('Parent Hover', 'blockera') +
			' - ' +
			__('Upgrade to RPO', 'blockera'),
		breakpoints: {},
		disabled: true,
	},
});

export default sharedBlockStates;
