// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { BreakpointTypes, TStates, TBreakpoint } from './types';

export default function (parentState: TStates = 'normal'): {
	[key: TBreakpoint]: BreakpointTypes,
} {
	const attributes = 'normal' === parentState ? {} : { attributes: {} };

	return {
		'2xl-desktop': {
			type: '2xl-desktop',
			force: false,
			label: __('2X Large Screens (Widescreen and TV)', 'blockera'),
			settings: {
				min: '1920px',
				max: '',
			},
			attributes: {},
		},
		'xl-desktop': {
			type: 'xl-desktop',
			force: false,
			label: __('X Large Screens', 'blockera'),
			settings: {
				min: '1440px',
				max: '',
			},
			attributes: {},
		},
		'l-desktop': {
			type: 'l-desktop',
			force: false,
			label: __('Large Desktop', 'blockera'),
			settings: {
				min: '1280px',
				max: '',
			},
			attributes: {},
		},
		desktop: {
			type: 'desktop',
			force: true,
			label: __('Desktop', 'blockera'),
			settings: {
				min: '',
				max: '',
			},
			...attributes,
		},
		tablet: {
			type: 'tablet',
			force: false,
			label: __('Tablet', 'blockera'),
			settings: {
				min: '',
				max: '991px',
			},
			attributes: {},
		},
		'mobile-landscape': {
			type: 'mobile-landscape',
			force: false,
			label: __('Mobile Landscape', 'blockera'),
			settings: {
				min: '',
				max: '767px',
			},
			attributes: {},
		},
		mobile: {
			type: 'mobile',
			force: false,
			label: __('Mobile Portrait', 'blockera'),
			settings: {
				min: '',
				max: '478px',
			},
			attributes: {},
		},
	};
}
