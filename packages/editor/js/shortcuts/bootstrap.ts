/**
 * Bootstrap function for Blockera Keyboard Shortcuts Extension.
 * Imports the shortcuts module which auto-registers the WordPress plugin.
 *
 * @package
 */

// Import the shortcuts module to trigger plugin registration
// The module auto-registers via registerPlugin() when imported
import './index';

/**
 * Initialize the shortcuts module.
 * This function ensures the shortcuts module is loaded and registered.
 */
export function bootstrapShortcuts(): void {
	// Module is already imported above, which triggers registration
	// This function exists for consistency with other bootstrap functions
}
