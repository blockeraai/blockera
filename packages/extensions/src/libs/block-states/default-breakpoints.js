// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { BreakpointTypes, TStates } from './types';

/**
 * Publisher dependencies
 */

/**
 * Internal dependencies
 */

export default function (
	parentState: TStates = 'normal'
): Array<BreakpointTypes> {
	const attributes = 'normal' === parentState ? {} : { attributes: {} };

	return [
		{
			type: 'laptop',
			force: true,
			label: __('Laptop', 'publisher-core'),
			settings: {
				min: '1025px',
				max: '1440px',
			},
			attributes: {},
		},
		{
			type: 'tablet',
			force: false,
			label: __('Tablet', 'publisher-core'),
			settings: {
				min: '768px',
				max: '1024px',
			},
			attributes: {},
		},
		{
			type: 'mobile-landscape',
			force: false,
			label: __('Mobile Landscape', 'publisher-core'),
			settings: {
				min: '481px',
				max: '767px',
			},
			attributes: {},
		},
		{
			type: 'mobile',
			force: false,
			label: __('Mobile', 'publisher-core'),
			settings: {
				min: '',
				max: '480px',
			},
			attributes: {},
		},
		{
			type: 'extra-large',
			force: false,
			label: __('Extra Large Screen', 'publisher-core'),
			settings: {
				min: '2561px',
				max: '',
			},
			attributes: {},
		},
		{
			type: 'large',
			force: false,
			label: __('Large Screen', 'publisher-core'),
			settings: {
				min: '1921px',
				max: '2560px',
			},
			attributes: {},
		},
		{
			type: 'desktop',
			force: false,
			label: __('Desktop', 'publisher-core'),
			settings: {
				min: '1441px',
				max: '1920px',
			},
			...attributes,
		},
	];
}
