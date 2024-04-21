/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export const getTypeOptions = function () {
	return [
		{
			type: 'optgroup',
			label: __('General', 'blockera-core'),
			options: [
				{
					label: __('Blur', 'blockera-core'),
					value: 'blur',
				},
				{
					label: __('Drop Shadow', 'blockera-core'),
					value: 'drop-shadow',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Color Adjustments', 'blockera-core'),
			options: [
				{
					label: __('Brightness', 'blockera-core'),
					value: 'brightness',
				},
				{
					label: __('Contrast', 'blockera-core'),
					value: 'contrast',
				},
				{
					label: __('Hue Rotate', 'blockera-core'),
					value: 'hue-rotate',
				},
				{
					label: __('Saturation', 'blockera-core'),
					value: 'saturate',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Color Effects', 'blockera-core'),
			options: [
				{
					label: __('Grayscale', 'blockera-core'),
					value: 'grayscale',
				},

				{
					label: __('Invert', 'blockera-core'),
					value: 'invert',
				},
				{
					label: __('Sepia', 'blockera-core'),
					value: 'sepia',
				},
			],
		},
	];
};
