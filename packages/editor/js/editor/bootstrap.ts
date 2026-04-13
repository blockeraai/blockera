/**
 * Bootstrap function for Blockera Editor.
 * Imports the editor module which auto-registers WordPress plugins.
 *
 * @package
 */

// Import the editor module to trigger plugin registration
// The module auto-registers via registerPlugin() when imported
import './index';

/**
 * Initialize the editor module.
 * This function ensures the editor module is loaded and registered.
 */
export function bootstrapEditor(): void {
	// Module is already imported above, which triggers registration
	// This function exists for consistency with other bootstrap functions
}
