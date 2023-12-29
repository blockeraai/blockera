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
			label: __('General', 'publisher-core'),
			options: [
				{
					label: __('Normal', 'publisher-core'),
					value: 'normal',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Inherit', 'publisher-core'),
					value: 'inherit',
					className: 'hide-icon',
					icon: <InheritIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Darken', 'publisher-core'),
			options: [
				{
					label: __('Darken', 'publisher-core'),
					value: 'darken',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Multiply', 'publisher-core'),
					value: 'multiply',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
			],
		},

		{
			type: 'optgroup',
			label: __('Lighten', 'publisher-core'),
			options: [
				{
					label: __('Lighten', 'publisher-core'),
					value: 'lighten',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Screen', 'publisher-core'),
					value: 'screen',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Contrast', 'publisher-core'),
			options: [
				{
					label: __('Overlay', 'publisher-core'),
					value: 'overlay',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Soft Light', 'publisher-core'),
					value: 'soft-light',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Hard Light', 'publisher-core'),
					value: 'hard-light',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Difference', 'publisher-core'),
			options: [
				{
					label: __('Difference', 'publisher-core'),
					value: 'difference',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Exclusion', 'publisher-core'),
					value: 'exclusion',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Hue', 'publisher-core'),
			options: [
				{
					label: __('Hue', 'publisher-core'),
					value: 'hue',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Color', 'publisher-core'),
					value: 'color',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Saturation', 'publisher-core'),
			options: [
				{
					label: __('Saturation', 'publisher-core'),
					value: 'saturation',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Color Dodge', 'publisher-core'),
					value: 'color-dodge',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Color Burn', 'publisher-core'),
					value: 'color-burn',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
				{
					label: __('Luminosity', 'publisher-core'),
					value: 'luminosity',
					className: 'hide-icon',
					icon: <BlendIcon />,
				},
			],
		},
	];
};
