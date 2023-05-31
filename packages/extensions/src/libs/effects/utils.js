/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

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
				},
				{
					label: __('Default', 'publisher-core'),
					value: 'default',
				},
				{
					label: __('none', 'publisher-core'),
					value: 'none',
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
				},
				{
					label: __('not-allowed', 'publisher-core'),
					value: 'not-allowed',
				},
				{
					label: __('wait', 'publisher-core'),
					value: 'wait',
				},
				{
					label: __('progress', 'publisher-core'),
					value: 'progress',
				},
				{
					label: __('help', 'publisher-core'),
					value: 'help',
				},
				{
					label: __('context-menu', 'publisher-core'),
					value: 'context-menu',
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
				},
				{
					label: __('crosshair', 'publisher-core'),
					value: 'crosshair',
				},
				{
					label: __('text', 'publisher-core'),
					value: 'text',
				},
				{
					label: __('vertical-text', 'publisher-core'),
					value: 'vertical-text',
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
				},
				{
					label: __('grabbing', 'publisher-core'),
					value: 'grabbing',
				},
				{
					label: __('alias', 'publisher-core'),
					value: 'alias',
				},
				{
					label: __('copy', 'publisher-core'),
					value: 'move',
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
				},
				{
					label: __('zoom-out', 'publisher-core'),
					value: 'zoom-out',
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
				},
				{
					label: __('row-resize', 'publisher-core'),
					value: 'row-resize',
				},

				{
					label: __('news-resize', 'publisher-core'),
					value: 'news-resize',
				},
				{
					label: __('nwse-resize', 'publisher-core'),
					value: 'nwse-resize',
				},
				{
					label: __('ew-resize', 'publisher-core'),
					value: 'ew-resize',
				},
				{
					label: __('ns-resize', 'publisher-core'),
					value: 'ns-resize',
				},
				{
					label: __('n-resize', 'publisher-core'),
					value: 'n-resize',
				},
				{
					label: __('w-resize', 'publisher-core'),
					value: 'w-resize',
				},
				{
					label: __('s-resize', 'publisher-core'),
					value: 's-resize',
				},
				{
					label: __('e-resize', 'publisher-core'),
					value: 'e-resize',
				},
				{
					label: __('nw-resize', 'publisher-core'),
					value: 'nw-resize',
				},
				{
					label: __('ne-resize', 'publisher-core'),
					value: 'ne-resize',
				},
				{
					label: __('sw-resize', 'publisher-core'),
					value: 'sw-resize',
				},
				{
					label: __('se-resize', 'publisher-core'),
					value: 'se-resize',
				},
			],
		},
	];
};
