/**
 * Internal dependencies
 */
import Colors from '.';
import { createGlobalStylesPanelHandler } from '../panel-override';

export const colorsPanelHandler = createGlobalStylesPanelHandler({
	panel: 'colors',
	wpNavigationPath: '/colors',
	Component: Colors,
	componentSelector: '.blockera-colors-panel',
	whileNotExistSelectors: ['.blockera-colors-hub'],
	observerLifetimeMs: 1000,
});
