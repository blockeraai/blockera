/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Whether the Blockera companion plugin (Blockera Site Builder) is active.
 *
 * In blockera-one theme mode this is false and companion-gated features
 * promote installing the plugin.
 */
export function isCompanionPlugin(): boolean {
	return applyFilters('blockera.products.isCompanionPlugin', false);
}
