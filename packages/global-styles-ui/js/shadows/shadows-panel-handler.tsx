/**
 * Internal dependencies
 */
import Shadows from './';
import {
	createGlobalStylesPanelHandler,
	disablePresetInspectorCleanup,
	removePresetOverrideBodyClass,
	BLOCKERA_SHADOWS_PRESET_INSPECTOR_ACTIVE_CLASS,
} from '../panel-override';

export const shadowsPanelHandler = createGlobalStylesPanelHandler({
	panel: 'shadows',
	wpNavigationPath: '/shadows',
	Component: Shadows,
	componentSelector: '.blockera-shadows-presets-navigation',
	whileNotExistSelectors: ['.blockera-shadows-presets-count'],
	observerLifetimeMs: 1000,
	onObserverReady: () =>
		document
			?.querySelector('button[data-wp-component="Navigator.BackButton"]')
			?.addEventListener?.(
				'click',
				() =>
					setTimeout(() => {
						disablePresetInspectorCleanup(
							BLOCKERA_SHADOWS_PRESET_INSPECTOR_ACTIVE_CLASS
						);
						removePresetOverrideBodyClass('shadows');
					}, 100),
				{
					once: true,
				}
			),
});
