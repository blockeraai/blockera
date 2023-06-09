/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { default as CursorAutoIcon } from './icons/cursors/auto';
import { default as CursorDefaultIcon } from './icons/cursors/default';
import { default as CursorNoneIcon } from './icons/cursors/none';
import { default as CursorPointerIcon } from './icons/cursors/pointer';
import { default as CursorNotAllowedIcon } from './icons/cursors/not-allowed';
import { default as CursorWaitIcon } from './icons/cursors/wait';
import { default as CursorHelpIcon } from './icons/cursors/help';
import { default as CursorContextMenuIcon } from './icons/cursors/context-menu';
import { default as CursorCellIcon } from './icons/cursors/cell';
import { default as CursorCrosshairIcon } from './icons/cursors/crosshair';
import { default as CursorTextIcon } from './icons/cursors/text';
import { default as CursorVerticalTextIcon } from './icons/cursors/vertical-text';
import { default as CursorGrabIcon } from './icons/cursors/grab';
import { default as CursorGrabbingIcon } from './icons/cursors/grabbing';
import { default as CursorAliasIcon } from './icons/cursors/alias';
import { default as CursorMoveIcon } from './icons/cursors/move';
import { default as CursorZoomInIcon } from './icons/cursors/zoom-in';
import { default as CursorZoomOutIcon } from './icons/cursors/zoom-out';
import { default as CursorColResizeIcon } from './icons/cursors/col-resize';
import { default as CursorRowResizeIcon } from './icons/cursors/row-resize';
import { default as CursorNeswResizeIcon } from './icons/cursors/nesw-resize';
import { default as CursorNwseResizeIcon } from './icons/cursors/nwse-resize';
import { default as CursorEwResizeIcon } from './icons/cursors/ew-resize';
import { default as CursorNsResizeIcon } from './icons/cursors/ns-resize';
import { default as CursorNResizeIcon } from './icons/cursors/n-resize';
import { default as CursorWResizeIcon } from './icons/cursors/w-resize';
import { default as CursorSResizeIcon } from './icons/cursors/s-resize';
import { default as CursorEResizeIcon } from './icons/cursors/e-resize';
import { default as CursorNwResizeIcon } from './icons/cursors/nw-resize';
import { default as CursorNeResizeIcon } from './icons/cursors/ne-resize';
import { default as CursorSwResizeIcon } from './icons/cursors/sw-resize';
import { default as CursorSeResizeIcon } from './icons/cursors/se-resize';
import { default as BlendIcon } from './icons/blend/blend';
import { default as BlendInheritIcon } from './icons/blend/blend-inherit';

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
					icon: <BlendInheritIcon />,
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

// list of all cursor options for select field
export const cursorFieldOptions = function () {
	return [
		{
			type: 'optgroup',
			label: __('General', 'publisher-core'),
			options: [
				{
					label: __('Auto', 'publisher-core'),
					value: 'auto',
					icon: <CursorAutoIcon />,
				},
				{
					label: __('Default', 'publisher-core'),
					value: 'default',
					icon: <CursorDefaultIcon />,
				},
				{
					label: __('none', 'publisher-core'),
					value: 'none',
					icon: <CursorNoneIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Links & Status', 'publisher-core'),
			options: [
				{
					label: __('pointer', 'publisher-core'),
					value: 'pointer',
					icon: <CursorPointerIcon />,
				},
				{
					label: __('not-allowed', 'publisher-core'),
					value: 'not-allowed',
					icon: <CursorNotAllowedIcon />,
				},
				{
					label: __('wait', 'publisher-core'),
					value: 'wait',
					icon: <CursorWaitIcon />,
				},
				{
					label: __('progress', 'publisher-core'),
					value: 'progress',
					icon: <CursorWaitIcon />,
				},
				{
					label: __('help', 'publisher-core'),
					value: 'help',
					icon: <CursorHelpIcon />,
				},
				{
					label: __('context-menu', 'publisher-core'),
					value: 'context-menu',
					icon: <CursorContextMenuIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Selection', 'publisher-core'),
			options: [
				{
					label: __('cell', 'publisher-core'),
					value: 'cell',
					icon: <CursorCellIcon />,
				},
				{
					label: __('crosshair', 'publisher-core'),
					value: 'crosshair',
					icon: <CursorCrosshairIcon />,
				},
				{
					label: __('text', 'publisher-core'),
					value: 'text',
					icon: <CursorTextIcon />,
				},
				{
					label: __('vertical-text', 'publisher-core'),
					value: 'vertical-text',
					icon: <CursorVerticalTextIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Drag & Drop', 'publisher-core'),
			options: [
				{
					label: __('grab', 'publisher-core'),
					value: 'grab',
					icon: <CursorGrabIcon />,
				},
				{
					label: __('grabbing', 'publisher-core'),
					value: 'grabbing',
					icon: <CursorGrabbingIcon />,
				},
				{
					label: __('alias', 'publisher-core'),
					value: 'alias',
					icon: <CursorAliasIcon />,
				},
				{
					label: __('copy', 'publisher-core'),
					value: 'move',
					icon: <CursorMoveIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Zoom', 'publisher-core'),
			options: [
				{
					label: __('zoom-in', 'publisher-core'),
					value: 'zoom-in',
					icon: <CursorZoomInIcon />,
				},
				{
					label: __('zoom-out', 'publisher-core'),
					value: 'zoom-out',
					icon: <CursorZoomOutIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Resize', 'publisher-core'),
			options: [
				{
					label: __('col-resize', 'publisher-core'),
					value: 'col-resize',
					icon: <CursorColResizeIcon />,
				},
				{
					label: __('row-resize', 'publisher-core'),
					value: 'row-resize',
					icon: <CursorRowResizeIcon />,
				},

				{
					label: __('nesw-resize', 'publisher-core'),
					value: 'nesw-resize',
					icon: <CursorNeswResizeIcon />,
				},
				{
					label: __('nwse-resize', 'publisher-core'),
					value: 'nwse-resize',
					icon: <CursorNwseResizeIcon />,
				},
				{
					label: __('ew-resize', 'publisher-core'),
					value: 'ew-resize',
					icon: <CursorEwResizeIcon />,
				},
				{
					label: __('ns-resize', 'publisher-core'),
					value: 'ns-resize',
					icon: <CursorNsResizeIcon />,
				},
				{
					label: __('n-resize', 'publisher-core'),
					value: 'n-resize',
					icon: <CursorNResizeIcon />,
				},
				{
					label: __('w-resize', 'publisher-core'),
					value: 'w-resize',
					icon: <CursorWResizeIcon />,
				},
				{
					label: __('s-resize', 'publisher-core'),
					value: 's-resize',
					icon: <CursorSResizeIcon />,
				},
				{
					label: __('e-resize', 'publisher-core'),
					value: 'e-resize',
					icon: <CursorEResizeIcon />,
				},
				{
					label: __('nw-resize', 'publisher-core'),
					value: 'nw-resize',
					icon: <CursorNwResizeIcon />,
				},
				{
					label: __('ne-resize', 'publisher-core'),
					value: 'ne-resize',
					icon: <CursorNeResizeIcon />,
				},
				{
					label: __('sw-resize', 'publisher-core'),
					value: 'sw-resize',
					icon: <CursorSwResizeIcon />,
				},
				{
					label: __('se-resize', 'publisher-core'),
					value: 'se-resize',
					icon: <CursorSeResizeIcon />,
				},
			],
		},
	];
};
