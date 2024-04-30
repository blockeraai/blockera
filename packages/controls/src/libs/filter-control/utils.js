/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export const getTypeOptions = function () {
	return [
		{
			type: 'optgroup',
			label: __('General', 'blockera'),
			options: [
				{
					label: __('Blur', 'blockera'),
					value: 'blur',
				},
				{
					label: __('Drop Shadow', 'blockera'),
					value: 'drop-shadow',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Color Adjustments', 'blockera'),
			options: [
				{
					label: __('Brightness', 'blockera'),
					value: 'brightness',
				},
				{
					label: __('Contrast', 'blockera'),
					value: 'contrast',
				},
				{
					label: __('Hue Rotate', 'blockera'),
					value: 'hue-rotate',
				},
				{
					label: __('Saturation', 'blockera'),
					value: 'saturate',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Color Effects', 'blockera'),
			options: [
				{
					label: __('Grayscale', 'blockera'),
					value: 'grayscale',
				},

				{
					label: __('Invert', 'blockera'),
					value: 'invert',
				},
				{
					label: __('Sepia', 'blockera'),
					value: 'sepia',
				},
			],
		},
	];
};
