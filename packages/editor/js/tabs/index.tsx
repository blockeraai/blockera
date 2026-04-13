/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal dependencies
 *
 * @see ./site-editor-post-item-route.md — `SiteEditorPostItemRouteRegistration` runs before tab UI.
 */
import TabsManager from './components/TabsManager';
import SiteEditorPostItemRouteRegistration from './components/SiteEditorPostItemRouteRegistration';

registerPlugin('blockera-tabs', {
	render: () => (
		<>
			<SiteEditorPostItemRouteRegistration />
			<TabsManager />
		</>
	),
	icon: null,
});

// Export bootstrap function
export { bootstrapTabs } from './bootstrap';
