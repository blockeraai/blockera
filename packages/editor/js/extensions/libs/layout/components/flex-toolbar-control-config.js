// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera flex toolbar options — same values/icons as LayoutMatrixControl axis selects.
 */
export type BlockeraFlexToolbarControl = {
	name: string,
	icon: string,
	title: string,
};

/** justify-content axis (main axis in row, main axis in column vertical toolbar). */
const JUSTIFY_CONTENT_TOOLBAR_CONTROLS: BlockeraFlexToolbarControl[] = [
	{
		name: 'flex-start',
		icon: 'justify-content-start',
		title: __('Start', 'blockera'),
	},
	{
		name: 'center',
		icon: 'justify-content-center',
		title: __('Center', 'blockera'),
	},
	{
		name: 'flex-end',
		icon: 'justify-content-end',
		title: __('End', 'blockera'),
	},
	{
		name: 'space-around',
		icon: 'justify-content-space-around',
		title: __('Space Around', 'blockera'),
	},
	{
		name: 'space-between',
		icon: 'justify-content-space-between',
		title: __('Space Between', 'blockera'),
	},
];

/** align-items axis (cross axis in row vertical toolbar, cross axis in column horizontal toolbar). */
const ALIGN_ITEMS_TOOLBAR_CONTROLS: BlockeraFlexToolbarControl[] = [
	{
		name: 'flex-start',
		icon: 'flex-align-start',
		title: __('Start', 'blockera'),
	},
	{
		name: 'center',
		icon: 'flex-align-center',
		title: __('Center', 'blockera'),
	},
	{
		name: 'flex-end',
		icon: 'flex-align-end',
		title: __('End', 'blockera'),
	},
	{
		name: 'stretch',
		icon: 'flex-align-stretch',
		title: __('Stretch', 'blockera'),
	},
];

/**
 * Horizontal screen toolbar (justify dropdown): main axis in row, cross axis in column.
 */
export const getHorizontalScreenToolbarControls = (
	direction: string
): BlockeraFlexToolbarControl[] =>
	'column' === direction
		? ALIGN_ITEMS_TOOLBAR_CONTROLS
		: JUSTIFY_CONTENT_TOOLBAR_CONTROLS;

/**
 * Vertical screen toolbar (align dropdown): cross axis in row, main axis in column.
 */
export const getVerticalScreenToolbarControls = (
	direction: string
): BlockeraFlexToolbarControl[] =>
	'column' === direction
		? JUSTIFY_CONTENT_TOOLBAR_CONTROLS
		: ALIGN_ITEMS_TOOLBAR_CONTROLS;
