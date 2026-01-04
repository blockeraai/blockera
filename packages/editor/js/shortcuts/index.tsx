/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal dependencies
 */
import KeyboardShortcutsExtension from './components/KeyboardShortcutsExtension';

// Register the plugin to extend keyboard shortcuts help modal
registerPlugin('blockera-keyboard-shortcuts-extension', {
	render: KeyboardShortcutsExtension,
	icon: null,
});

// Export bootstrap function
export { bootstrapShortcuts } from './bootstrap';
