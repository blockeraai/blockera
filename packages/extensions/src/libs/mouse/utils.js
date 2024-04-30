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

// list of all cursor options for select field
export const cursorFieldOptions = function () {
	return [
		{
			type: 'optgroup',
			label: __('General', 'blockera'),
			options: [
				{
					label: __('Auto', 'blockera'),
					value: 'auto',
					icon: <CursorPointerIcon />,
				},
				{
					label: __('Default', 'blockera'),
					value: 'default',
					icon: <CursorPointerIcon />,
				},
				{
					label: __('none', 'blockera'),
					value: 'none',
					icon: <CursorNoneIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Links & Status', 'blockera'),
			options: [
				{
					label: __('pointer', 'blockera'),
					value: 'pointer',
					icon: <CursorPointerIcon />,
				},
				{
					label: __('not-allowed', 'blockera'),
					value: 'not-allowed',
					icon: <CursorNotAllowedIcon />,
				},
				{
					label: __('wait', 'blockera'),
					value: 'wait',
					icon: <CursorWaitIcon />,
				},
				{
					label: __('progress', 'blockera'),
					value: 'progress',
					icon: <CursorWaitIcon />,
				},
				{
					label: __('help', 'blockera'),
					value: 'help',
					icon: <CursorHelpIcon />,
				},
				{
					label: __('context-menu', 'blockera'),
					value: 'context-menu',
					icon: <CursorContextMenuIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Selection', 'blockera'),
			options: [
				{
					label: __('cell', 'blockera'),
					value: 'cell',
					icon: <CursorCellIcon />,
				},
				{
					label: __('crosshair', 'blockera'),
					value: 'crosshair',
					icon: <CursorCrosshairIcon />,
				},
				{
					label: __('text', 'blockera'),
					value: 'text',
					icon: <CursorTextIcon />,
				},
				{
					label: __('vertical-text', 'blockera'),
					value: 'vertical-text',
					icon: <CursorVerticalTextIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Drag & Drop', 'blockera'),
			options: [
				{
					label: __('grab', 'blockera'),
					value: 'grab',
					icon: <CursorGrabIcon />,
				},
				{
					label: __('grabbing', 'blockera'),
					value: 'grabbing',
					icon: <CursorGrabbingIcon />,
				},
				{
					label: __('alias', 'blockera'),
					value: 'alias',
					icon: <CursorAliasIcon />,
				},
				{
					label: __('copy', 'blockera'),
					value: 'move',
					icon: <CursorMoveIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Zoom', 'blockera'),
			options: [
				{
					label: __('zoom-in', 'blockera'),
					value: 'zoom-in',
					icon: <CursorZoomInIcon />,
				},
				{
					label: __('zoom-out', 'blockera'),
					value: 'zoom-out',
					icon: <CursorZoomOutIcon />,
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Resize', 'blockera'),
			options: [
				{
					label: __('col-resize', 'blockera'),
					value: 'col-resize',
					icon: <CursorColResizeIcon />,
				},
				{
					label: __('row-resize', 'blockera'),
					value: 'row-resize',
					icon: <CursorRowResizeIcon />,
				},

				{
					label: __('nesw-resize', 'blockera'),
					value: 'nesw-resize',
					icon: <CursorNeswResizeIcon />,
				},
				{
					label: __('nwse-resize', 'blockera'),
					value: 'nwse-resize',
					icon: <CursorNwseResizeIcon />,
				},
				{
					label: __('ew-resize', 'blockera'),
					value: 'ew-resize',
					icon: <CursorEwResizeIcon />,
				},
				{
					label: __('ns-resize', 'blockera'),
					value: 'ns-resize',
					icon: <CursorNsResizeIcon />,
				},
				{
					label: __('n-resize', 'blockera'),
					value: 'n-resize',
					icon: <CursorNResizeIcon />,
				},
				{
					label: __('w-resize', 'blockera'),
					value: 'w-resize',
					icon: <CursorWResizeIcon />,
				},
				{
					label: __('s-resize', 'blockera'),
					value: 's-resize',
					icon: <CursorSResizeIcon />,
				},
				{
					label: __('e-resize', 'blockera'),
					value: 'e-resize',
					icon: <CursorEResizeIcon />,
				},
				{
					label: __('nw-resize', 'blockera'),
					value: 'nw-resize',
					icon: <CursorNwResizeIcon />,
				},
				{
					label: __('ne-resize', 'blockera'),
					value: 'ne-resize',
					icon: <CursorNeResizeIcon />,
				},
				{
					label: __('sw-resize', 'blockera'),
					value: 'sw-resize',
					icon: <CursorSwResizeIcon />,
				},
				{
					label: __('se-resize', 'blockera'),
					value: 'se-resize',
					icon: <CursorSeResizeIcon />,
				},
			],
		},
	];
};

// list of all user-select options
export const userSelectOptions = function () {
	return [
		{
			label: __('None', 'blockera'),
			value: 'none',
		},
		{
			label: __('Auto', 'blockera'),
			value: 'auto',
		},
		{
			label: __('Text', 'blockera'),
			value: 'text',
		},
		{
			label: __('Contain', 'blockera'),
			value: 'contain',
		},
		{
			label: __('All', 'blockera'),
			value: 'all',
		},
	];
};

// list of all pointer-events
export const pointerEventsOptions = function () {
	return [
		{
			type: 'optgroup',
			label: __('Common', 'blockera'),
			options: [
				{
					label: __('Auto', 'blockera'),
					value: 'auto',
				},
				{
					label: __('All', 'blockera'),
					value: 'all',
				},
				{
					label: __('none', 'blockera'),
					value: 'none',
				},
			],
		},
		{
			type: 'optgroup',
			label: __('Other', 'blockera'),
			options: [
				{
					label: __('Inherit', 'blockera'),
					value: 'inherit',
				},
				{
					label: __('Initial', 'blockera'),
					value: 'initial',
				},
				{
					label: __('Revert', 'blockera'),
					value: 'revert',
				},
				{
					label: __('Revert Layer', 'blockera'),
					value: 'revert-layer',
				},
				{
					label: __('Unset', 'blockera'),
					value: 'unset',
				},
			],
		},
	];
};
