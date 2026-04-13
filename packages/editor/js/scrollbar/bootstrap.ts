/**
 * Bootstrap function for Blockera Scrollbar.
 * Imports the scrollbar module which auto-registers the WordPress plugin.
 *
 * @package
 */

// Import the scrollbar module to trigger plugin registration
// The module auto-registers via registerPlugin() when imported
import './index';

/**
 * Initialize the scrollbar module.
 * This function ensures the scrollbar module is loaded and registered.
 */
export function bootstrapScrollbar(): void {
	// Module is already imported above, which triggers registration
	// This function exists for consistency with other bootstrap functions
}
