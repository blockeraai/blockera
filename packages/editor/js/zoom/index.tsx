/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal dependencies
 */
import ZoomControl from './components/ZoomControl';

/**
 * Blockera Zoom Plugin
 * Adds zoom controls to the WordPress block editor canvas.
 * Works in both Post Editor and Site Editor.
 */
function BlockeraZoom(): JSX.Element {
	return <ZoomControl />;
}

// Register the plugin with WordPress
registerPlugin('blockera-zoom', {
	render: BlockeraZoom,
	icon: null,
});

// Export bootstrap function
export { bootstrapZoom } from './bootstrap';
