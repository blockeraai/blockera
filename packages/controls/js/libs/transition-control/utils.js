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

export const getTypeOptions = function (): Array<Object> {
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
					label: __('Margin', 'blockera'),
					value: 'margin',
				},
				{
					label: __('Padding', 'blockera'),
					value: 'padding',
				},
				{
					label: __('Border', 'blockera'),
					value: 'border',
				},
				{
					label: __('Transform', 'blockera'),
					value: 'transform',
				},
				{
					label: __('Filter', 'blockera'),
					value: 'filter',
				},
				{
					label: __('Flex', 'blockera'),
					value: 'flex',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Background Transitions', 'blockera'),
			options: [
				{
					label: __('Background Color', 'blockera'),
					value: 'background-color',
				},
				{
					label: __('Background Position', 'blockera'),
					value: 'background-position',
				},
				{
					label: __('Text Shadow', 'blockera'),
					value: 'text-shadow',
				},
				{
					label: __('Box Shadow', 'blockera'),
					value: 'box-shadow',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Size Transitions', 'blockera'),
			options: [
				{
					label: __('Width', 'blockera'),
					value: 'width',
				},
				{
					label: __('Height', 'blockera'),
					value: 'height',
				},
				{
					label: __('Max Height', 'blockera'),
					value: 'max-height',
				},
				{
					label: __('Max Width', 'blockera'),
					value: 'max-width',
				},
				{
					label: __('Min Height', 'blockera'),
					value: 'min-height',
				},
				{
					label: __('Min Width', 'blockera'),
					value: 'min-width',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Borders Transitions', 'blockera'),
			options: [
				{
					label: __('Border Radius', 'blockera'),
					value: 'border-radius',
				},
				{
					label: __('Border Color', 'blockera'),
					value: 'border-color',
				},
				{
					label: __('Border Width', 'blockera'),
					value: 'border-width',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Typography Transitions', 'blockera'),
			options: [
				{
					label: __('Font Color', 'blockera'),
					value: 'color',
				},
				{
					label: __('Font Size', 'blockera'),
					value: 'font-size',
				},
				{
					label: __('Line Height', 'blockera'),
					value: 'line-height',
				},
				{
					label: __('Letter Spacing', 'blockera'),
					value: 'letter-spacing',
				},
				{
					label: __('Text Indent', 'blockera'),
					value: 'text-indent',
				},
				{
					label: __('Word Spacing', 'blockera'),
					value: 'word-spacing',
				},
				{
					label: __('Font Variation', 'blockera'),
					value: 'font-variation-settings',
				},
				{
					label: __('Text Stroke Color', 'blockera'),
					value: '-webkit-text-stroke-color',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Position Transitions', 'blockera'),
			options: [
				{
					label: __('Top', 'blockera'),
					value: 'top',
				},
				{
					label: __('Right', 'blockera'),
					value: 'right',
				},
				{
					label: __('Bottom', 'blockera'),
					value: 'bottom',
				},
				{
					label: __('Left', 'blockera'),
					value: 'left',
				},
				{
					label: __('Z-Index', 'blockera'),
					value: 'z-index',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Margin Transitions', 'blockera'),
			options: [
				{
					label: __('Margin Top', 'blockera'),
					value: 'margin-top',
				},
				{
					label: __('Margin Right', 'blockera'),
					value: 'margin-right',
				},
				{
					label: __('Margin Bottom', 'blockera'),
					value: 'margin-bottom',
				},
				{
					label: __('Margin Left', 'blockera'),
					value: 'margin-left',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Padding Transitions', 'blockera'),
			options: [
				{
					label: __('Padding Top', 'blockera'),
					value: 'padding-top',
				},
				{
					label: __('Padding Right', 'blockera'),
					value: 'padding-right',
				},
				{
					label: __('Padding Bottom', 'blockera'),
					value: 'padding-bottom',
				},
				{
					label: __('Padding Left', 'blockera'),
					value: 'padding-left',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Flex Transitions', 'blockera'),
			options: [
				{
					label: __('Flex Grow', 'blockera'),
					value: 'flex-grow',
				},
				{
					label: __('Flex Shrink', 'blockera'),
					value: 'flex-shrink',
				},
				{
					label: __('Flex Basis', 'blockera'),
					value: 'flex-basis',
				},
			],
		},
	];
};

export const getTimingOptions = function (): Array<Object> {
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
					label: __('Ease In Quad', 'blockera'),
					value: 'ease-in-quad',
				},
				{
					label: __('Ease In Cubic', 'blockera'),
					value: 'ease-in-cubic',
				},
				{
					label: __('Ease In Quart', 'blockera'),
					value: 'ease-in-cubic',
				},
				{
					label: __('Ease In Quint', 'blockera'),
					value: 'ease-in-quint',
				},
				{
					label: __('Ease In Sine', 'blockera'),
					value: 'ease-in-sine',
				},
				{
					label: __('Ease In Expo', 'blockera'),
					value: 'ease-in-expo',
				},
				{
					label: __('Ease In Circ', 'blockera'),
					value: 'ease-in-circ',
				},
				{
					label: __('Ease In Back', 'blockera'),
					value: 'ease-in-back',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Ease Out Timings', 'blockera'),
			options: [
				{
					label: __('Ease Out Quad', 'blockera'),
					value: 'ease-out-quad',
				},
				{
					label: __('Ease Out Cubic', 'blockera'),
					value: 'ease-out-cubic',
				},
				{
					label: __('Ease Out Quart', 'blockera'),
					value: 'ease-out-quart',
				},
				{
					label: __('Ease Out Quint', 'blockera'),
					value: 'ease-out-quint',
				},
				{
					label: __('Ease Out Sine', 'blockera'),
					value: 'ease-out-sine',
				},
				{
					label: __('Ease Out Expo', 'blockera'),
					value: 'ease-out-expo',
				},
				{
					label: __('Ease Out Circ', 'blockera'),
					value: 'ease-out-circ',
				},
				{
					label: __('Ease Out Back', 'blockera'),
					value: 'ease-out-back',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Ease In Out Timings', 'blockera'),
			options: [
				{
					label: __('Ease In Out Quad', 'blockera'),
					value: 'ease-in-out-quad',
				},
				{
					label: __('Ease In Out Cubic', 'blockera'),
					value: 'ease-in-out-cubic',
				},
				{
					label: __('Ease In Out Quart', 'blockera'),
					value: 'ease-in-out-quart',
				},
				{
					label: __('Ease In Out Quint', 'blockera'),
					value: 'ease-in-out-quint',
				},
				{
					label: __('Ease In Out Sine', 'blockera'),
					value: 'ease-in-out-sine',
				},
				{
					label: __('easeInOutExpo', 'blockera'),
					value: 'ease-in-out-expo',
				},
				{
					label: __('Ease In Out Circ', 'blockera'),
					value: 'ease-in-out-circ',
				},
				{
					label: __('Ease In Out Back', 'blockera'),
					value: 'ease-in-out-back',
				},
			],
		},
	];
};
