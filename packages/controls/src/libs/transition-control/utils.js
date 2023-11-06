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
			return __('All', 'publisher-core');

		case 'opacity':
			return __('Opacity', 'publisher-core');

		case 'margin':
			return __('Margin', 'publisher-core');

		case 'padding':
			return __('Padding', 'publisher-core');

		case 'border':
			return __('Border', 'publisher-core');

		case 'transform':
			return __('Transform', 'publisher-core');

		case 'filter':
			return __('Filter', 'publisher-core');

		case 'flex':
			return __('Flex', 'publisher-core');

		case 'background-color':
			return __('Background Color', 'publisher-core');

		case 'background-position':
			return __('Background Position', 'publisher-core');

		case 'text-shadow':
			return __('Text Shadow', 'publisher-core');

		case 'box-shadow':
			return __('Box Shadow', 'publisher-core');

		case 'width':
			return __('Width', 'publisher-core');

		case 'height':
			return __('Height', 'publisher-core');

		case 'max-height':
			return __('Max Height', 'publisher-core');

		case 'max-width':
			return __('Max Width', 'publisher-core');

		case 'min-height':
			return __('Min Height', 'publisher-core');

		case 'min-width':
			return __('Min Width', 'publisher-core');

		case 'border-radius':
			return __('Border Radius', 'publisher-core');

		case 'border-color':
			return __('Border Color', 'publisher-core');

		case 'border-width':
			return __('Border Width', 'publisher-core');

		case 'color':
			return __('Font Color', 'publisher-core');

		case 'font-size':
			return __('Font Size', 'publisher-core');

		case 'line-height':
			return __('Line Height', 'publisher-core');

		case 'letter-spacing':
			return __('Letter Spacing', 'publisher-core');

		case 'text-indent':
			return __('Text Indent', 'publisher-core');

		case 'word-spacing':
			return __('Word Spacing', 'publisher-core');

		case 'font-variation-settings':
			return __('Font Variation', 'publisher-core');

		case '-webkit-text-stroke-color':
			return __('Text Stroke Color', 'publisher-core');

		case 'top':
			return __('Top', 'publisher-core');

		case 'right':
			return __('Right', 'publisher-core');

		case 'bottom':
			return __('Bottom', 'publisher-core');

		case 'left':
			return __('Left', 'publisher-core');

		case 'z-index':
			return __('Z-Index', 'publisher-core');

		case 'margin-top':
			return __('Margin Top', 'publisher-core');

		case 'margin-right':
			return __('Margin Right', 'publisher-core');

		case 'margin-bottom':
			return __('Margin Bottom', 'publisher-core');

		case 'margin-left':
			return __('Margin Left', 'publisher-core');

		case 'padding-top':
			return __('Padding Top', 'publisher-core');

		case 'padding-right':
			return __('Padding Right', 'publisher-core');

		case 'padding-bottom':
			return __('Padding Bottom', 'publisher-core');

		case 'padding-left':
			return __('Padding Left', 'publisher-core');

		case 'flex-grow':
			return __('Flex Grow', 'publisher-core');

		case 'flex-shrink':
			return __('Flex Shrink', 'publisher-core');

		case 'flex-basis':
			return __('Flex Basis', 'publisher-core');

		default:
			return type;
	}
};

export const getTypeOptions = function (): Array<Object> {
	return [
		{
			type: 'optgroup',
			label: __('Common Transitions', 'publisher-core'),
			options: [
				{
					label: __('All Properties', 'publisher-core'),
					value: 'all',
				},
				{
					label: __('Opacity', 'publisher-core'),
					value: 'opacity',
				},
				{
					label: __('Margin', 'publisher-core'),
					value: 'margin',
				},
				{
					label: __('Padding', 'publisher-core'),
					value: 'padding',
				},
				{
					label: __('Border', 'publisher-core'),
					value: 'border',
				},
				{
					label: __('Transform', 'publisher-core'),
					value: 'transform',
				},
				{
					label: __('Filter', 'publisher-core'),
					value: 'filter',
				},
				{
					label: __('Flex', 'publisher-core'),
					value: 'flex',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Background Transitions', 'publisher-core'),
			options: [
				{
					label: __('Background Color', 'publisher-core'),
					value: 'background-color',
				},
				{
					label: __('Background Position', 'publisher-core'),
					value: 'background-position',
				},
				{
					label: __('Text Shadow', 'publisher-core'),
					value: 'text-shadow',
				},
				{
					label: __('Box Shadow', 'publisher-core'),
					value: 'box-shadow',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Size Transitions', 'publisher-core'),
			options: [
				{
					label: __('Width', 'publisher-core'),
					value: 'width',
				},
				{
					label: __('Height', 'publisher-core'),
					value: 'height',
				},
				{
					label: __('Max Height', 'publisher-core'),
					value: 'max-height',
				},
				{
					label: __('Max Width', 'publisher-core'),
					value: 'max-width',
				},
				{
					label: __('Min Height', 'publisher-core'),
					value: 'min-height',
				},
				{
					label: __('Min Width', 'publisher-core'),
					value: 'min-width',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Borders Transitions', 'publisher-core'),
			options: [
				{
					label: __('Border Radius', 'publisher-core'),
					value: 'border-radius',
				},
				{
					label: __('Border Color', 'publisher-core'),
					value: 'border-color',
				},
				{
					label: __('Border Width', 'publisher-core'),
					value: 'border-width',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Typography Transitions', 'publisher-core'),
			options: [
				{
					label: __('Font Color', 'publisher-core'),
					value: 'color',
				},
				{
					label: __('Font Size', 'publisher-core'),
					value: 'font-size',
				},
				{
					label: __('Line Height', 'publisher-core'),
					value: 'line-height',
				},
				{
					label: __('Letter Spacing', 'publisher-core'),
					value: 'letter-spacing',
				},
				{
					label: __('Text Indent', 'publisher-core'),
					value: 'text-indent',
				},
				{
					label: __('Word Spacing', 'publisher-core'),
					value: 'word-spacing',
				},
				{
					label: __('Font Variation', 'publisher-core'),
					value: 'font-variation-settings',
				},
				{
					label: __('Text Stroke Color', 'publisher-core'),
					value: '-webkit-text-stroke-color',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Position Transitions', 'publisher-core'),
			options: [
				{
					label: __('Top', 'publisher-core'),
					value: 'top',
				},
				{
					label: __('Right', 'publisher-core'),
					value: 'right',
				},
				{
					label: __('Bottom', 'publisher-core'),
					value: 'bottom',
				},
				{
					label: __('Left', 'publisher-core'),
					value: 'left',
				},
				{
					label: __('Z-Index', 'publisher-core'),
					value: 'z-index',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Margin Transitions', 'publisher-core'),
			options: [
				{
					label: __('Margin Top', 'publisher-core'),
					value: 'margin-top',
				},
				{
					label: __('Margin Right', 'publisher-core'),
					value: 'margin-right',
				},
				{
					label: __('Margin Bottom', 'publisher-core'),
					value: 'margin-bottom',
				},
				{
					label: __('Margin Left', 'publisher-core'),
					value: 'margin-left',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Padding Transitions', 'publisher-core'),
			options: [
				{
					label: __('Padding Top', 'publisher-core'),
					value: 'padding-top',
				},
				{
					label: __('Padding Right', 'publisher-core'),
					value: 'padding-right',
				},
				{
					label: __('Padding Bottom', 'publisher-core'),
					value: 'padding-bottom',
				},
				{
					label: __('Padding Left', 'publisher-core'),
					value: 'padding-left',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Flex Transitions', 'publisher-core'),
			options: [
				{
					label: __('Flex Grow', 'publisher-core'),
					value: 'flex-grow',
				},
				{
					label: __('Flex Shrink', 'publisher-core'),
					value: 'flex-shrink',
				},
				{
					label: __('Flex Basis', 'publisher-core'),
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
			label: __('Default Timings', 'publisher-core'),
			options: [
				{
					label: __('Linear', 'publisher-core'),
					value: 'linear',
				},
				{
					label: __('Ease', 'publisher-core'),
					value: 'ease',
				},
				{
					label: __('Ease In', 'publisher-core'),
					value: 'ease-in',
				},
				{
					label: __('Ease Out', 'publisher-core'),
					value: 'ease-out',
				},
				{
					label: __('Ease In Out', 'publisher-core'),
					value: 'ease-in-out',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Ease In Timings', 'publisher-core'),
			options: [
				{
					label: __('Ease In Quad', 'publisher-core'),
					value: 'ease-in-quad',
				},
				{
					label: __('Ease In Cubic', 'publisher-core'),
					value: 'ease-in-cubic',
				},
				{
					label: __('Ease In Quart', 'publisher-core'),
					value: 'ease-in-cubic',
				},
				{
					label: __('Ease In Quint', 'publisher-core'),
					value: 'ease-in-quint',
				},
				{
					label: __('Ease In Sine', 'publisher-core'),
					value: 'ease-in-sine',
				},
				{
					label: __('Ease In Expo', 'publisher-core'),
					value: 'ease-in-expo',
				},
				{
					label: __('Ease In Circ', 'publisher-core'),
					value: 'ease-in-circ',
				},
				{
					label: __('Ease In Back', 'publisher-core'),
					value: 'ease-in-back',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Ease Out Timings', 'publisher-core'),
			options: [
				{
					label: __('Ease Out Quad', 'publisher-core'),
					value: 'ease-out-quad',
				},
				{
					label: __('Ease Out Cubic', 'publisher-core'),
					value: 'ease-out-cubic',
				},
				{
					label: __('Ease Out Quart', 'publisher-core'),
					value: 'ease-out-quart',
				},
				{
					label: __('Ease Out Quint', 'publisher-core'),
					value: 'ease-out-quint',
				},
				{
					label: __('Ease Out Sine', 'publisher-core'),
					value: 'ease-out-sine',
				},
				{
					label: __('Ease Out Expo', 'publisher-core'),
					value: 'ease-out-expo',
				},
				{
					label: __('Ease Out Circ', 'publisher-core'),
					value: 'ease-out-circ',
				},
				{
					label: __('Ease Out Back', 'publisher-core'),
					value: 'ease-out-back',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Ease In Out Timings', 'publisher-core'),
			options: [
				{
					label: __('Ease In Out Quad', 'publisher-core'),
					value: 'ease-in-out-quad',
				},
				{
					label: __('Ease In Out Cubic', 'publisher-core'),
					value: 'ease-in-out-cubic',
				},
				{
					label: __('Ease In Out Quart', 'publisher-core'),
					value: 'ease-in-out-quart',
				},
				{
					label: __('Ease In Out Quint', 'publisher-core'),
					value: 'ease-in-out-quint',
				},
				{
					label: __('Ease In Out Sine', 'publisher-core'),
					value: 'ease-in-out-sine',
				},
				{
					label: __('easeInOutExpo', 'publisher-core'),
					value: 'ease-in-out-expo',
				},
				{
					label: __('Ease In Out Circ', 'publisher-core'),
					value: 'ease-in-out-circ',
				},
				{
					label: __('Ease In Out Back', 'publisher-core'),
					value: 'ease-in-out-back',
				},
			],
		},
	];
};
