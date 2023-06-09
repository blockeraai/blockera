/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import CursorPointerIcon from './icons/cursors/pointer';
import CursorNoneIcon from './icons/cursors/none';
import CursorNotAllowedIcon from './icons/cursors/not-allowed';
import CursorWaitIcon from './icons/cursors/wait';
import CursorHelpIcon from './icons/cursors/help';
import CursorContextMenuIcon from './icons/cursors/context-menu';
import CursorCellIcon from './icons/cursors/cell';
import CursorCrosshairIcon from './icons/cursors/crosshair';
import CursorTextIcon from './icons/cursors/text';
import CursorVerticalTextIcon from './icons/cursors/vertical-text';
import CursorGrabIcon from './icons/cursors/grab';
import CursorGrabbingIcon from './icons/cursors/grabbing';
import CursorAliasIcon from './icons/cursors/alias';
import CursorMoveIcon from './icons/cursors/move';
import CursorZoomInIcon from './icons/cursors/zoom-in';
import CursorZoomOutIcon from './icons/cursors/zoom-out';
import CursorColResizeIcon from './icons/cursors/col-resize';
import CursorRowResizeIcon from './icons/cursors/row-resize';
import CursorNeswResizeIcon from './icons/cursors/nesw-resize';
import CursorNwseResizeIcon from './icons/cursors/nwse-resize';
import CursorEwResizeIcon from './icons/cursors/ew-resize';
import CursorNsResizeIcon from './icons/cursors/ns-resize';
import CursorNResizeIcon from './icons/cursors/n-resize';
import CursorWResizeIcon from './icons/cursors/w-resize';
import CursorSResizeIcon from './icons/cursors/s-resize';
import CursorEResizeIcon from './icons/cursors/e-resize';
import CursorNwResizeIcon from './icons/cursors/nw-resize';
import CursorNeResizeIcon from './icons/cursors/ne-resize';
import CursorSwResizeIcon from './icons/cursors/sw-resize';
import CursorSeResizeIcon from './icons/cursors/se-resize';
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
					icon: <CursorPointerIcon />,
				},
				{
					label: __('Default', 'publisher-core'),
					value: 'default',
					icon: <CursorPointerIcon />,
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
