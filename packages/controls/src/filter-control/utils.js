/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export const getTypeOptions = function () {
	return [
		{
			type: 'optgroup',
			label: __('General', 'publisher-core'),
			options: [
				{
					label: __('Blur', 'publisher-core'),
					value: 'blur',
				},
				{
					label: __('Drop Shadow', 'publisher-core'),
					value: 'drop-shadow',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Color Adjustments', 'publisher-core'),
			options: [
				{
					label: __('Brightness', 'publisher-core'),
					value: 'brightness',
				},
				{
					label: __('Contrast', 'publisher-core'),
					value: 'contrast',
				},
				{
					label: __('Hue Rotate', 'publisher-core'),
					value: 'hue-rotate',
				},
				{
					label: __('Saturation', 'publisher-core'),
					value: 'saturate',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Color Effects', 'publisher-core'),
			options: [
				{
					label: __('Grayscale', 'publisher-core'),
					value: 'grayscale',
				},

				{
					label: __('Invert', 'publisher-core'),
					value: 'invert',
				},
				{
					label: __('Sepia', 'publisher-core'),
					value: 'sepia',
				},
			],
		},
	];
};
