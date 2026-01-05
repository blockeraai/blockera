/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Mapping of sub-category IDs to their display labels.
 * If a sub-category is not defined here, its ID will be used as the label.
 */
export const subCategoryLabels: Record<string, string> = {
	general: __('Blockera general shortcuts', 'blockera'),
	tabs: __('Tabs shortcuts', 'blockera'),
	'preview-mode': __('Preview mode shortcuts', 'blockera'),
	zoom: __('Zoom shortcuts', 'blockera'),
	'list-view': __('List view shortcuts', 'blockera'),
};

/**
 * Static list defining the sort order for Blockera sub-categories.
 * Sub-categories will be displayed in this order in the keyboard shortcuts modal.
 * If a sub-category is not in this list, it will appear after the listed ones.
 */
export const subCategorySortOrder: string[] = [
	'general',
	'tabs',
	'zoom',
	'preview-mode',
];
