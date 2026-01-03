/**
 * Bootstrap function for Blockera Preview Mode.
 * Imports the preview-mode module which auto-registers the WordPress plugin.
 *
 * @package
 */

// Import the preview-mode module to trigger plugin registration
// The module auto-registers via registerPlugin() when imported
import './index';

/**
 * Initialize the preview mode module.
 * This function ensures the preview-mode module is loaded and registered.
 */
export function bootstrapPreviewMode(): void {
	// Module is already imported above, which triggers registration
	// This function exists for consistency with other bootstrap functions
}
