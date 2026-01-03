/**
 * Bootstrap function for Blockera Tabs.
 * Imports the tabs module which auto-registers the WordPress plugin.
 *
 * @package
 */

// Import the tabs module to trigger plugin registration
// The module auto-registers via registerPlugin() when imported
import './index';

/**
 * Initialize the tabs module.
 * This function ensures the tabs module is loaded and registered.
 */
export function bootstrapTabs(): void {
	// Module is already imported above, which triggers registration
	// This function exists for consistency with other bootstrap functions
}
