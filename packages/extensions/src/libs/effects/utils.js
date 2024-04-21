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
			label: __('General', 'blockera-core'),
			options: [
				{
					label: __('Normal', 'blockera-core'),
					value: 'normal',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Inherit', 'blockera-core'),
					value: 'inherit',
					className: 'hide-icon',
					icon: <InheritIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Darken', 'blockera-core'),
			options: [
				{
					label: __('Darken', 'blockera-core'),
					value: 'darken',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Multiply', 'blockera-core'),
					value: 'multiply',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
			],
		},

		{
			type: 'optgroup',
			label: __('Lighten', 'blockera-core'),
			options: [
				{
					label: __('Lighten', 'blockera-core'),
					value: 'lighten',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Screen', 'blockera-core'),
					value: 'screen',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Contrast', 'blockera-core'),
			options: [
				{
					label: __('Overlay', 'blockera-core'),
					value: 'overlay',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Soft Light', 'blockera-core'),
					value: 'soft-light',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Hard Light', 'blockera-core'),
					value: 'hard-light',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Difference', 'blockera-core'),
			options: [
				{
					label: __('Difference', 'blockera-core'),
					value: 'difference',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Exclusion', 'blockera-core'),
					value: 'exclusion',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Hue', 'blockera-core'),
			options: [
				{
					label: __('Hue', 'blockera-core'),
					value: 'hue',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Color', 'blockera-core'),
					value: 'color',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Saturation', 'blockera-core'),
			options: [
				{
					label: __('Saturation', 'blockera-core'),
					value: 'saturation',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Color Dodge', 'blockera-core'),
					value: 'color-dodge',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Color Burn', 'blockera-core'),
					value: 'color-burn',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Luminosity', 'blockera-core'),
					value: 'luminosity',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
			],
		},
	];
};
