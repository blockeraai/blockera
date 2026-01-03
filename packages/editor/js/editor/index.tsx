/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal dependencies
 */
import './store-persistence'; // Initialize the store
import SecondarySidebarInjector from './secondary-sidebar';
import PrimarySidebarController from './primary-sidebar';


/**
 * Plugin configurations for the editor package.
 * Add new plugin configurations here as the package grows.
 */
const editorPlugins = [
	{
		name: 'blockera-combined-sidebar',
		render: SecondarySidebarInjector,
		icon: null,
	},
	{
		name: 'blockera-primary-sidebar-controller',
		render: PrimarySidebarController,
		icon: null,
	},
];

/**
 * Register all editor plugins.
 */
editorPlugins.forEach((plugin) => {
	registerPlugin(plugin.name, {
		render: plugin.render,
		icon: plugin.icon,
	});
});

// Export bootstrap function
export { bootstrapEditor } from './bootstrap';
