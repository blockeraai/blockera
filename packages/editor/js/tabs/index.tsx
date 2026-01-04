/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal dependencies
 */
import TabsManager from './components/TabsManager';

registerPlugin('blockera-tabs', {
	render: () => (
		<>
			<TabsManager />
		</>
	),
	icon: null,
});

// Export bootstrap function
export { bootstrapTabs } from './bootstrap';
