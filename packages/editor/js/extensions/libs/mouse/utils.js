/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';

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
					icon: <Icon library="cursor" icon="pointer" />,
				},
				{
					label: __('Default', 'blockera'),
					value: 'default',
					icon: <Icon library="cursor" icon="pointer" />,
				},
				{
					label: __('none', 'blockera'),
					value: 'none',
					icon: <Icon library="cursor" icon="none" />,
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
					icon: <Icon library="cursor" icon="pointer" />,
				},
				{
					label: __('not-allowed', 'blockera'),
					value: 'not-allowed',
					icon: <Icon library="cursor" icon="not-allowed" />,
				},
				{
					label: __('wait', 'blockera'),
					value: 'wait',
					icon: <Icon library="cursor" icon="wait" />,
				},
				{
					label: __('progress', 'blockera'),
					value: 'progress',
					icon: <Icon library="cursor" icon="wait" />,
				},
				{
					label: __('help', 'blockera'),
					value: 'help',
					icon: <Icon library="cursor" icon="help" />,
				},
				{
					label: __('context-menu', 'blockera'),
					value: 'context-menu',
					icon: <Icon library="cursor" icon="context-menu" />,
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
					icon: <Icon library="cursor" icon="cell" />,
				},
				{
					label: __('crosshair', 'blockera'),
					value: 'crosshair',
					icon: <Icon library="cursor" icon="crosshair" />,
				},
				{
					label: __('text', 'blockera'),
					value: 'text',
					icon: <Icon library="cursor" icon="text" />,
				},
				{
					label: __('vertical-text', 'blockera'),
					value: 'vertical-text',
					icon: <Icon library="cursor" icon="vertical-text" />,
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
					icon: <Icon library="cursor" icon="grab" />,
				},
				{
					label: __('grabbing', 'blockera'),
					value: 'grabbing',
					icon: <Icon library="cursor" icon="grabbing" />,
				},
				{
					label: __('alias', 'blockera'),
					value: 'alias',
					icon: <Icon library="cursor" icon="alias" />,
				},
				{
					label: __('move', 'blockera'),
					value: 'move',
					icon: <Icon library="cursor" icon="move" />,
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
					icon: <Icon library="cursor" icon="zoom-in" />,
				},
				{
					label: __('zoom-out', 'blockera'),
					value: 'zoom-out',
					icon: <Icon library="cursor" icon="zoom-out" />,
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
					icon: <Icon library="cursor" icon="col-resize" />,
				},
				{
					label: __('row-resize', 'blockera'),
					value: 'row-resize',
					icon: <Icon library="cursor" icon="row-resize" />,
				},
				{
					label: __('nesw-resize', 'blockera'),
					value: 'nesw-resize',
					icon: <Icon library="cursor" icon="nesw-resize" />,
				},
				{
					label: __('nwse-resize', 'blockera'),
					value: 'nwse-resize',
					icon: <Icon library="cursor" icon="nwse-resize" />,
				},
				{
					label: __('ew-resize', 'blockera'),
					value: 'ew-resize',
					icon: <Icon library="cursor" icon="ew-resize" />,
				},
				{
					label: __('ns-resize', 'blockera'),
					value: 'ns-resize',
					icon: <Icon library="cursor" icon="ns-resize" />,
				},
				{
					label: __('n-resize', 'blockera'),
					value: 'n-resize',
					icon: <Icon library="cursor" icon="n-resize" />,
				},
				{
					label: __('w-resize', 'blockera'),
					value: 'w-resize',
					icon: <Icon library="cursor" icon="w-resize" />,
				},
				{
					label: __('s-resize', 'blockera'),
					value: 's-resize',
					icon: <Icon library="cursor" icon="s-resize" />,
				},
				{
					label: __('e-resize', 'blockera'),
					value: 'e-resize',
					icon: <Icon library="cursor" icon="e-resize" />,
				},
				{
					label: __('nw-resize', 'blockera'),
					value: 'nw-resize',
					icon: <Icon library="cursor" icon="nw-resize" />,
				},
				{
					label: __('ne-resize', 'blockera'),
					value: 'ne-resize',
					icon: <Icon library="cursor" icon="ne-resize" />,
				},
				{
					label: __('sw-resize', 'blockera'),
					value: 'sw-resize',
					icon: <Icon library="cursor" icon="sw-resize" />,
				},
				{
					label: __('se-resize', 'blockera'),
					value: 'se-resize',
					icon: <Icon library="cursor" icon="se-resize" />,
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
