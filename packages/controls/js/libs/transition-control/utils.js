// @flow
/**
 * WordPress dependencies
 */

import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import type { TGetTypeLabelProps } from './types';

export const getTypeLabel = function (type: TGetTypeLabelProps): string {
	switch (type) {
		case 'all':
			return __('All', 'blockera');

		case 'opacity':
			return __('Opacity', 'blockera');

		case 'margin':
			return __('Margin', 'blockera');

		case 'padding':
			return __('Padding', 'blockera');

		case 'border':
			return __('Border', 'blockera');

		case 'transform':
			return __('Transform', 'blockera');

		case 'filter':
			return __('Filter', 'blockera');

		case 'flex':
			return __('Flex', 'blockera');

		case 'background-color':
			return __('Background Color', 'blockera');

		case 'background-position':
			return __('Background Position', 'blockera');

		case 'text-shadow':
			return __('Text Shadow', 'blockera');

		case 'box-shadow':
			return __('Box Shadow', 'blockera');

		case 'width':
			return __('Width', 'blockera');

		case 'height':
			return __('Height', 'blockera');

		case 'max-height':
			return __('Max Height', 'blockera');

		case 'max-width':
			return __('Max Width', 'blockera');

		case 'min-height':
			return __('Min Height', 'blockera');

		case 'min-width':
			return __('Min Width', 'blockera');

		case 'border-radius':
			return __('Border Radius', 'blockera');

		case 'border-color':
			return __('Border Color', 'blockera');

		case 'border-width':
			return __('Border Width', 'blockera');

		case 'color':
			return __('Font Color', 'blockera');

		case 'font-size':
			return __('Font Size', 'blockera');

		case 'line-height':
			return __('Line Height', 'blockera');

		case 'letter-spacing':
			return __('Letter Spacing', 'blockera');

		case 'text-indent':
			return __('Text Indent', 'blockera');

		case 'word-spacing':
			return __('Word Spacing', 'blockera');

		case 'font-variation-settings':
			return __('Font Variation', 'blockera');

		case '-webkit-text-stroke-color':
			return __('Text Stroke Color', 'blockera');

		case 'top':
			return __('Top', 'blockera');

		case 'right':
			return __('Right', 'blockera');

		case 'bottom':
			return __('Bottom', 'blockera');

		case 'left':
			return __('Left', 'blockera');

		case 'z-index':
			return __('Z-Index', 'blockera');

		case 'margin-top':
			return __('Margin Top', 'blockera');

		case 'margin-right':
			return __('Margin Right', 'blockera');

		case 'margin-bottom':
			return __('Margin Bottom', 'blockera');

		case 'margin-left':
			return __('Margin Left', 'blockera');

		case 'padding-top':
			return __('Padding Top', 'blockera');

		case 'padding-right':
			return __('Padding Right', 'blockera');

		case 'padding-bottom':
			return __('Padding Bottom', 'blockera');

		case 'padding-left':
			return __('Padding Left', 'blockera');

		case 'flex-grow':
			return __('Flex Grow', 'blockera');

		case 'flex-shrink':
			return __('Flex Shrink', 'blockera');

		case 'flex-basis':
			return __('Flex Basis', 'blockera');

		default:
			return type;
	}
};

export const getTransitionTypeOptions = function (): Array<Object> {
	return [
		{
			type: 'optgroup',
			label: __('Common Transitions', 'blockera'),
			options: [
				{
					label: __('All Properties', 'blockera'),
					value: 'all',
				},
				{
					label: __('Opacity', 'blockera'),
					value: 'opacity',
				},
				{
					label:
						__('Margin', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'margin',
					disabled: true,
				},
				{
					label:
						__('Padding', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'padding',
					disabled: true,
				},
				{
					label:
						__('Border', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'border',
					disabled: true,
				},
				{
					label:
						__('Transform', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'transform',
					disabled: true,
				},
				{
					label:
						__('Filter', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'filter',
					disabled: true,
				},
				{
					label:
						__('Flex', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'flex',
					disabled: true,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Background Transitions', 'blockera'),
			options: [
				{
					label:
						__('Background Color', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'background-color',
					disabled: true,
				},
				{
					label:
						__('Background Position', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'background-position',
					disabled: true,
				},
				{
					label:
						__('Text Shadow', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'text-shadow',
					disabled: true,
				},
				{
					label:
						__('Box Shadow', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'box-shadow',
					disabled: true,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Size Transitions', 'blockera'),
			options: [
				{
					label:
						__('Width', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'width',
					disabled: true,
				},
				{
					label:
						__('Height', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'height',
					disabled: true,
				},
				{
					label:
						__('Max Height', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'max-height',
					disabled: true,
				},
				{
					label:
						__('Max Width', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'max-width',
					disabled: true,
				},
				{
					label:
						__('Min Height', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'min-height',
					disabled: true,
				},
				{
					label:
						__('Min Width', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'min-width',
					disabled: true,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Borders Transitions', 'blockera'),
			options: [
				{
					label:
						__('Border Radius', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'border-radius',
					disabled: true,
				},
				{
					label:
						__('Border Color', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'border-color',
					disabled: true,
				},
				{
					label:
						__('Border Width', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'border-width',
					disabled: true,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Typography Transitions', 'blockera'),
			options: [
				{
					label:
						__('Font Color', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'color',
					disabled: true,
				},
				{
					label:
						__('Font Size', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'font-size',
					disabled: true,
				},
				{
					label:
						__('Line Height', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'line-height',
					disabled: true,
				},
				{
					label:
						__('Letter Spacing', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'letter-spacing',
					disabled: true,
				},
				{
					label:
						__('Text Indent', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'text-indent',
					disabled: true,
				},
				{
					label:
						__('Word Spacing', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'word-spacing',
					disabled: true,
				},
				{
					label:
						__('Font Variation', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'font-variation-settings',
					disabled: true,
				},
				{
					label:
						__('Text Stroke Color', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: '-webkit-text-stroke-color',
					disabled: true,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Position Transitions', 'blockera'),
			options: [
				{
					label:
						__('Top', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'top',
					disabled: true,
				},
				{
					label:
						__('Right', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'right',
					disabled: true,
				},
				{
					label:
						__('Bottom', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'bottom',
					disabled: true,
				},
				{
					label:
						__('Left', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'left',
					disabled: true,
				},
				{
					label:
						__('Z-Index', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'z-index',
					disabled: true,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Margin Transitions', 'blockera'),
			options: [
				{
					label:
						__('Margin Top', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'margin-top',
					disabled: true,
				},
				{
					label:
						__('Margin Right', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'margin-right',
					disabled: true,
				},
				{
					label:
						__('Margin Bottom', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'margin-bottom',
					disabled: true,
				},
				{
					label:
						__('Margin Left', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'margin-left',
					disabled: true,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Padding Transitions', 'blockera'),
			options: [
				{
					label:
						__('Padding Top', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'padding-top',
					disabled: true,
				},
				{
					label:
						__('Padding Right', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'padding-right',
					disabled: true,
				},
				{
					label:
						__('Padding Bottom', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'padding-bottom',
					disabled: true,
				},
				{
					label:
						__('Padding Left', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'padding-left',
					disabled: true,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Flex Transitions', 'blockera'),
			options: [
				{
					label:
						__('Flex Grow', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'flex-grow',
					disabled: true,
				},
				{
					label:
						__('Flex Shrink', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'flex-shrink',
					disabled: true,
				},
				{
					label:
						__('Flex Basis', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'flex-basis',
					disabled: true,
				},
			],
		},
	];
};

export const getTransitionTimingOptions = function (): Array<Object> {
	return [
		{
			type: 'optgroup',
			label: __('Default Timings', 'blockera'),
			options: [
				{
					label: __('Linear', 'blockera'),
					value: 'linear',
				},
				{
					label: __('Ease', 'blockera'),
					value: 'ease',
				},
				{
					label: __('Ease In', 'blockera'),
					value: 'ease-in',
				},
				{
					label: __('Ease Out', 'blockera'),
					value: 'ease-out',
				},
				{
					label: __('Ease In Out', 'blockera'),
					value: 'ease-in-out',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Ease In Timings', 'blockera'),
			options: [
				{
					label:
						__('Ease In Quad', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-in-quad',
					disabled: true,
				},
				{
					label:
						__('Ease In Cubic', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-in-cubic',
					disabled: true,
				},
				{
					label:
						__('Ease In Quart', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-in-cubic',
					disabled: true,
				},
				{
					label:
						__('Ease In Quint', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-in-quint',
					disabled: true,
				},
				{
					label:
						__('Ease In Sine', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-in-sine',
					disabled: true,
				},
				{
					label:
						__('Ease In Expo', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-in-expo',
					disabled: true,
				},
				{
					label:
						__('Ease In Circ', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-in-circ',
					disabled: true,
				},
				{
					label:
						__('Ease In Back', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-in-back',
					disabled: true,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Ease Out Timings', 'blockera'),
			options: [
				{
					label:
						__('Ease Out Quad', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-out-quad',
					disabled: true,
				},
				{
					label:
						__('Ease Out Cubic', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-out-cubic',
					disabled: true,
				},
				{
					label:
						__('Ease Out Quart', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-out-quart',
					disabled: true,
				},
				{
					label:
						__('Ease Out Quint', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-out-quint',
					disabled: true,
				},
				{
					label:
						__('Ease Out Sine', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-out-sine',
					disabled: true,
				},
				{
					label:
						__('Ease Out Expo', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-out-expo',
					disabled: true,
				},
				{
					label:
						__('Ease Out Circ', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-out-circ',
					disabled: true,
				},
				{
					label:
						__('Ease Out Back', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-out-back',
					disabled: true,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Ease In Out Timings', 'blockera'),
			options: [
				{
					label:
						__('Ease In Out Quad', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-in-out-quad',
					disabled: true,
				},
				{
					label:
						__('Ease In Out Cubic', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-in-out-cubic',
					disabled: true,
				},
				{
					label:
						__('Ease In Out Quart', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-in-out-quart',
					disabled: true,
				},
				{
					label:
						__('Ease In Out Quint', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-in-out-quint',
					disabled: true,
				},
				{
					label:
						__('Ease In Out Sine', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-in-out-sine',
					disabled: true,
				},
				{
					label:
						__('easeInOutExpo', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-in-out-expo',
					disabled: true,
				},
				{
					label:
						__('Ease In Out Circ', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-in-out-circ',
					disabled: true,
				},
				{
					label:
						__('Ease In Out Back', 'blockera') +
						' - ' +
						__('Upgrade to PRO', 'blockera'),
					value: 'ease-in-out-back',
					disabled: true,
				},
			],
		},
	];
};
