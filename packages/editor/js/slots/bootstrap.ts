/**
 * Bootstrap function for Blockera Slots.
 * Imports the slots module which auto-registers the WordPress plugin.
 *
 * @package
 */

// Import the slots plugin to trigger plugin registration
// The plugin auto-registers via registerPlugin() when imported
import './plugin';

/**
 * Initialize the slots module.
 * This function ensures the slots module is loaded and registered.
 */
export function bootstrapSlots(): void {
	// Module is already imported above, which triggers registration
	// This function exists for consistency with other bootstrap functions
}
