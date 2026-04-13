/**
 * Bootstrap function for Blockera Zoom.
 * Imports the zoom module which auto-registers the WordPress plugin.
 *
 * @package
 */

// Import the zoom module to trigger plugin registration
// The module auto-registers via registerPlugin() when imported
import './index';

/**
 * Initialize the zoom module.
 * This function ensures the zoom module is loaded and registered.
 */
export function bootstrapZoom(): void {
	// Module is already imported above, which triggers registration
	// This function exists for consistency with other bootstrap functions
}
