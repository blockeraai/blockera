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
			return __('All', 'blockera-core');

		case 'opacity':
			return __('Opacity', 'blockera-core');

		case 'margin':
			return __('Margin', 'blockera-core');

		case 'padding':
			return __('Padding', 'blockera-core');

		case 'border':
			return __('Border', 'blockera-core');

		case 'transform':
			return __('Transform', 'blockera-core');

		case 'filter':
			return __('Filter', 'blockera-core');

		case 'flex':
			return __('Flex', 'blockera-core');

		case 'background-color':
			return __('Background Color', 'blockera-core');

		case 'background-position':
			return __('Background Position', 'blockera-core');

		case 'text-shadow':
			return __('Text Shadow', 'blockera-core');

		case 'box-shadow':
			return __('Box Shadow', 'blockera-core');

		case 'width':
			return __('Width', 'blockera-core');

		case 'height':
			return __('Height', 'blockera-core');

		case 'max-height':
			return __('Max Height', 'blockera-core');

		case 'max-width':
			return __('Max Width', 'blockera-core');

		case 'min-height':
			return __('Min Height', 'blockera-core');

		case 'min-width':
			return __('Min Width', 'blockera-core');

		case 'border-radius':
			return __('Border Radius', 'blockera-core');

		case 'border-color':
			return __('Border Color', 'blockera-core');

		case 'border-width':
			return __('Border Width', 'blockera-core');

		case 'color':
			return __('Font Color', 'blockera-core');

		case 'font-size':
			return __('Font Size', 'blockera-core');

		case 'line-height':
			return __('Line Height', 'blockera-core');

		case 'letter-spacing':
			return __('Letter Spacing', 'blockera-core');

		case 'text-indent':
			return __('Text Indent', 'blockera-core');

		case 'word-spacing':
			return __('Word Spacing', 'blockera-core');

		case 'font-variation-settings':
			return __('Font Variation', 'blockera-core');

		case '-webkit-text-stroke-color':
			return __('Text Stroke Color', 'blockera-core');

		case 'top':
			return __('Top', 'blockera-core');

		case 'right':
			return __('Right', 'blockera-core');

		case 'bottom':
			return __('Bottom', 'blockera-core');

		case 'left':
			return __('Left', 'blockera-core');

		case 'z-index':
			return __('Z-Index', 'blockera-core');

		case 'margin-top':
			return __('Margin Top', 'blockera-core');

		case 'margin-right':
			return __('Margin Right', 'blockera-core');

		case 'margin-bottom':
			return __('Margin Bottom', 'blockera-core');

		case 'margin-left':
			return __('Margin Left', 'blockera-core');

		case 'padding-top':
			return __('Padding Top', 'blockera-core');

		case 'padding-right':
			return __('Padding Right', 'blockera-core');

		case 'padding-bottom':
			return __('Padding Bottom', 'blockera-core');

		case 'padding-left':
			return __('Padding Left', 'blockera-core');

		case 'flex-grow':
			return __('Flex Grow', 'blockera-core');

		case 'flex-shrink':
			return __('Flex Shrink', 'blockera-core');

		case 'flex-basis':
			return __('Flex Basis', 'blockera-core');

		default:
			return type;
	}
};

export const getTypeOptions = function (): Array<Object> {
	return [
		{
			type: 'optgroup',
			label: __('Common Transitions', 'blockera-core'),
			options: [
				{
					label: __('All Properties', 'blockera-core'),
					value: 'all',
				},
				{
					label: __('Opacity', 'blockera-core'),
					value: 'opacity',
				},
				{
					label: __('Margin', 'blockera-core'),
					value: 'margin',
				},
				{
					label: __('Padding', 'blockera-core'),
					value: 'padding',
				},
				{
					label: __('Border', 'blockera-core'),
					value: 'border',
				},
				{
					label: __('Transform', 'blockera-core'),
					value: 'transform',
				},
				{
					label: __('Filter', 'blockera-core'),
					value: 'filter',
				},
				{
					label: __('Flex', 'blockera-core'),
					value: 'flex',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Background Transitions', 'blockera-core'),
			options: [
				{
					label: __('Background Color', 'blockera-core'),
					value: 'background-color',
				},
				{
					label: __('Background Position', 'blockera-core'),
					value: 'background-position',
				},
				{
					label: __('Text Shadow', 'blockera-core'),
					value: 'text-shadow',
				},
				{
					label: __('Box Shadow', 'blockera-core'),
					value: 'box-shadow',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Size Transitions', 'blockera-core'),
			options: [
				{
					label: __('Width', 'blockera-core'),
					value: 'width',
				},
				{
					label: __('Height', 'blockera-core'),
					value: 'height',
				},
				{
					label: __('Max Height', 'blockera-core'),
					value: 'max-height',
				},
				{
					label: __('Max Width', 'blockera-core'),
					value: 'max-width',
				},
				{
					label: __('Min Height', 'blockera-core'),
					value: 'min-height',
				},
				{
					label: __('Min Width', 'blockera-core'),
					value: 'min-width',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Borders Transitions', 'blockera-core'),
			options: [
				{
					label: __('Border Radius', 'blockera-core'),
					value: 'border-radius',
				},
				{
					label: __('Border Color', 'blockera-core'),
					value: 'border-color',
				},
				{
					label: __('Border Width', 'blockera-core'),
					value: 'border-width',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Typography Transitions', 'blockera-core'),
			options: [
				{
					label: __('Font Color', 'blockera-core'),
					value: 'color',
				},
				{
					label: __('Font Size', 'blockera-core'),
					value: 'font-size',
				},
				{
					label: __('Line Height', 'blockera-core'),
					value: 'line-height',
				},
				{
					label: __('Letter Spacing', 'blockera-core'),
					value: 'letter-spacing',
				},
				{
					label: __('Text Indent', 'blockera-core'),
					value: 'text-indent',
				},
				{
					label: __('Word Spacing', 'blockera-core'),
					value: 'word-spacing',
				},
				{
					label: __('Font Variation', 'blockera-core'),
					value: 'font-variation-settings',
				},
				{
					label: __('Text Stroke Color', 'blockera-core'),
					value: '-webkit-text-stroke-color',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Position Transitions', 'blockera-core'),
			options: [
				{
					label: __('Top', 'blockera-core'),
					value: 'top',
				},
				{
					label: __('Right', 'blockera-core'),
					value: 'right',
				},
				{
					label: __('Bottom', 'blockera-core'),
					value: 'bottom',
				},
				{
					label: __('Left', 'blockera-core'),
					value: 'left',
				},
				{
					label: __('Z-Index', 'blockera-core'),
					value: 'z-index',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Margin Transitions', 'blockera-core'),
			options: [
				{
					label: __('Margin Top', 'blockera-core'),
					value: 'margin-top',
				},
				{
					label: __('Margin Right', 'blockera-core'),
					value: 'margin-right',
				},
				{
					label: __('Margin Bottom', 'blockera-core'),
					value: 'margin-bottom',
				},
				{
					label: __('Margin Left', 'blockera-core'),
					value: 'margin-left',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Padding Transitions', 'blockera-core'),
			options: [
				{
					label: __('Padding Top', 'blockera-core'),
					value: 'padding-top',
				},
				{
					label: __('Padding Right', 'blockera-core'),
					value: 'padding-right',
				},
				{
					label: __('Padding Bottom', 'blockera-core'),
					value: 'padding-bottom',
				},
				{
					label: __('Padding Left', 'blockera-core'),
					value: 'padding-left',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Flex Transitions', 'blockera-core'),
			options: [
				{
					label: __('Flex Grow', 'blockera-core'),
					value: 'flex-grow',
				},
				{
					label: __('Flex Shrink', 'blockera-core'),
					value: 'flex-shrink',
				},
				{
					label: __('Flex Basis', 'blockera-core'),
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
			label: __('Default Timings', 'blockera-core'),
			options: [
				{
					label: __('Linear', 'blockera-core'),
					value: 'linear',
				},
				{
					label: __('Ease', 'blockera-core'),
					value: 'ease',
				},
				{
					label: __('Ease In', 'blockera-core'),
					value: 'ease-in',
				},
				{
					label: __('Ease Out', 'blockera-core'),
					value: 'ease-out',
				},
				{
					label: __('Ease In Out', 'blockera-core'),
					value: 'ease-in-out',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Ease In Timings', 'blockera-core'),
			options: [
				{
					label: __('Ease In Quad', 'blockera-core'),
					value: 'ease-in-quad',
				},
				{
					label: __('Ease In Cubic', 'blockera-core'),
					value: 'ease-in-cubic',
				},
				{
					label: __('Ease In Quart', 'blockera-core'),
					value: 'ease-in-cubic',
				},
				{
					label: __('Ease In Quint', 'blockera-core'),
					value: 'ease-in-quint',
				},
				{
					label: __('Ease In Sine', 'blockera-core'),
					value: 'ease-in-sine',
				},
				{
					label: __('Ease In Expo', 'blockera-core'),
					value: 'ease-in-expo',
				},
				{
					label: __('Ease In Circ', 'blockera-core'),
					value: 'ease-in-circ',
				},
				{
					label: __('Ease In Back', 'blockera-core'),
					value: 'ease-in-back',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Ease Out Timings', 'blockera-core'),
			options: [
				{
					label: __('Ease Out Quad', 'blockera-core'),
					value: 'ease-out-quad',
				},
				{
					label: __('Ease Out Cubic', 'blockera-core'),
					value: 'ease-out-cubic',
				},
				{
					label: __('Ease Out Quart', 'blockera-core'),
					value: 'ease-out-quart',
				},
				{
					label: __('Ease Out Quint', 'blockera-core'),
					value: 'ease-out-quint',
				},
				{
					label: __('Ease Out Sine', 'blockera-core'),
					value: 'ease-out-sine',
				},
				{
					label: __('Ease Out Expo', 'blockera-core'),
					value: 'ease-out-expo',
				},
				{
					label: __('Ease Out Circ', 'blockera-core'),
					value: 'ease-out-circ',
				},
				{
					label: __('Ease Out Back', 'blockera-core'),
					value: 'ease-out-back',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Ease In Out Timings', 'blockera-core'),
			options: [
				{
					label: __('Ease In Out Quad', 'blockera-core'),
					value: 'ease-in-out-quad',
				},
				{
					label: __('Ease In Out Cubic', 'blockera-core'),
					value: 'ease-in-out-cubic',
				},
				{
					label: __('Ease In Out Quart', 'blockera-core'),
					value: 'ease-in-out-quart',
				},
				{
					label: __('Ease In Out Quint', 'blockera-core'),
					value: 'ease-in-out-quint',
				},
				{
					label: __('Ease In Out Sine', 'blockera-core'),
					value: 'ease-in-out-sine',
				},
				{
					label: __('easeInOutExpo', 'blockera-core'),
					value: 'ease-in-out-expo',
				},
				{
					label: __('Ease In Out Circ', 'blockera-core'),
					value: 'ease-in-out-circ',
				},
				{
					label: __('Ease In Out Back', 'blockera-core'),
					value: 'ease-in-out-back',
				},
			],
		},
	];
};
