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
			type: 'desktop',
			force: true,
			label: __('Desktop', 'publisher-core'),
			settings: {
				min: '980px',
				max: '1800px',
			},
			...attributes,
		},
		{
			type: 'tablet',
			force: false,
			label: __('Tablet', 'publisher-core'),
			settings: {
				min: '810px',
				max: '1080px',
			},
			attributes: {},
		},
		{
			type: 'mobile',
			force: false,
			label: __('Mobile', 'publisher-core'),
			settings: {
				min: '412px',
				max: '915px',
			},
			attributes: {},
		},
	];
}
