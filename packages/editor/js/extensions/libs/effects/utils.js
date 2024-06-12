/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import BlendIcon from './icons/blend/blend';
import InheritIcon from '../../icons/inherit';

// list of all cursor options for select field
export const blendModeFieldOptions = function () {
	return [
		{
			type: 'optgroup',
			label: __('General', 'blockera'),
			options: [
				{
					label: __('Normal', 'blockera'),
					value: 'normal',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Inherit', 'blockera'),
					value: 'inherit',
					className: 'hide-icon',
					icon: <InheritIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Darken', 'blockera'),
			options: [
				{
					label: __('Darken', 'blockera'),
					value: 'darken',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Multiply', 'blockera'),
					value: 'multiply',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
			],
		},

		{
			type: 'optgroup',
			label: __('Lighten', 'blockera'),
			options: [
				{
					label: __('Lighten', 'blockera'),
					value: 'lighten',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Screen', 'blockera'),
					value: 'screen',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Contrast', 'blockera'),
			options: [
				{
					label: __('Overlay', 'blockera'),
					value: 'overlay',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Soft Light', 'blockera'),
					value: 'soft-light',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Hard Light', 'blockera'),
					value: 'hard-light',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Difference', 'blockera'),
			options: [
				{
					label: __('Difference', 'blockera'),
					value: 'difference',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Exclusion', 'blockera'),
					value: 'exclusion',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Hue', 'blockera'),
			options: [
				{
					label: __('Hue', 'blockera'),
					value: 'hue',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Color', 'blockera'),
					value: 'color',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Saturation', 'blockera'),
			options: [
				{
					label: __('Saturation', 'blockera'),
					value: 'saturation',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Color Dodge', 'blockera'),
					value: 'color-dodge',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Color Burn', 'blockera'),
					value: 'color-burn',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Luminosity', 'blockera'),
					value: 'luminosity',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
			],
		},
	];
};
