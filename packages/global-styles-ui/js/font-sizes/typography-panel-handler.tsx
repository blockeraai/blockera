/**
 * Internal dependencies
 */
import FontSizes from '.';
import { createGlobalStylesPanelHandler } from '../panel-override';

export const typographyPanelHandler = createGlobalStylesPanelHandler({
	panel: 'typography',
	wpNavigationPath: '/typography',
	Component: FontSizes,
	componentSelector: '.blockera-font-size-panel',
	whileNotExistSelectors: ['.blockera-font-size-hub'],
});
