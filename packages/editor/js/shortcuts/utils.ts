/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { subCategoryLabels } from './constants';

/**
 * Gets the display label for a sub-category ID.
 * Returns the mapped label if available, otherwise returns the ID formatted as a label.
 *
 * @param subCategoryId - The sub-category ID (e.g., 'tabs', 'preview-mode').
 * @return The display label for the sub-category.
 */
export function getSubCategoryLabel(subCategoryId: string): string {
	return (
		subCategoryLabels[subCategoryId] ||
		sprintf(
			/* translators: %s is the sub-category ID. */
			__('%s shortcuts', 'blockera'),
			subCategoryId.replace('-', ' ')
		)
	);
}
