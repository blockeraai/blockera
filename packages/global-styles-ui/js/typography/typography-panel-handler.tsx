/**
 * Internal dependencies
 */
import Typography from '.';
import { createGlobalStylesPanelHandler } from '../panel-override';

export const typographyPanelHandler = createGlobalStylesPanelHandler({
	panel: 'typography',
	wpNavigationPath: '/typography',
	Component: Typography,
	componentSelector: '.blockera-typography-panel',
	whileNotExistSelectors: ['.blockera-typography-hub'],
});
