export {
	normalizeWordPressVersion,
	isWordPressVersionAtLeast,
	isWordPress70OrHigher,
	getWordPressVersion,
} from './version';

export {
	getGlobalStylesPanelSelectors,
	getGlobalStylesPanelTargets,
	queryGlobalStylesPanelElement,
	queryActiveGlobalStylesNavigatorScreen,
	queryStyleBookIframe,
	getDualGlobalStylesSelector,
	getStyleBookBlockExampleSelector,
	type GlobalStylesPanelSelectors,
	type GlobalStylesPanelTargets,
} from './selectors';

export {
	BLOCKERA_GLOBAL_STYLES_UI_BODY_CLASS,
	BLOCKERA_NAVIGATION_OVERRIDE_CLASS,
	BLOCKERA_NAVIGATION_PANEL_CLASS,
	getPresetOverrideBodyClass,
	addPresetOverrideBodyClass,
	removePresetOverrideBodyClass,
	navigateToGlobalStylesPath,
	type PresetPanelOverride,
	removeBlockeraGlobalStylesUiBodyClass,
} from './override-classes';

export {
	createGlobalStylesPanelHandler,
	type GlobalStylesPanelHandlerOptions,
} from './create-panel-handler';

export {
	findGlobalStylesNavigatorBackButton,
	findGlobalStylesScreenHeader,
	setGlobalStylesScreenHeaderTitle,
	revealGlobalStylesScreenHeader,
	attachGlobalStylesNavigatorBackListener,
	NAVIGATOR_BACK_BUTTON_COMPONENT,
	NAVIGATOR_BACK_RETRY_INTERVAL_MS,
	NAVIGATOR_BACK_MAX_RETRY_ATTEMPTS,
	type AttachGlobalStylesNavigatorBackOptions,
} from './navigator-back-button';

export { useOverrideNavigator } from './use-override-navigator';

export {
	BLOCKERA_CLEANUP_SCREEN_STYLES_CLASS,
	BLOCKERA_COLORS_PRESET_INSPECTOR_ACTIVE_CLASS,
	BLOCKERA_FONT_SIZE_PRESET_INSPECTOR_ACTIVE_CLASS,
	BLOCKERA_SHADOWS_PRESET_INSPECTOR_ACTIVE_CLASS,
	enablePresetInspectorCleanup,
	disablePresetInspectorCleanup,
	markPresetInspectorActive,
} from './cleanup-screen-styles';

import './styles.scss';
