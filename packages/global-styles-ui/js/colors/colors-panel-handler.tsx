/**
 * Internal dependencies
 */
import Colors from '.';
import { createGlobalStylesPanelHandler } from '../panel-override';

export const colorsPanelHandler = createGlobalStylesPanelHandler({
	panel: 'colors',
	wpNavigationPath: '/colors',
	Component: Colors,
	componentSelector: '.blockera-colors-presets-navigation',
	whileNotExistSelectors: ['.blockera-colors-presets-count'],
	observerLifetimeMs: 1000,
});
