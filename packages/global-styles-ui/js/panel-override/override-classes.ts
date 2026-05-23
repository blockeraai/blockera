export type PresetPanelOverride = 'colors' | 'typography' | 'shadows';

export const BLOCKERA_GLOBAL_STYLES_UI_BODY_CLASS =
	'has-blockera-global-styles-ui';

export const BLOCKERA_NAVIGATION_OVERRIDE_CLASS =
	'is-open-blockera-navigation-override';

export const BLOCKERA_NAVIGATION_PANEL_CLASS =
	'is-open-blockera-navigation-panel';

export const getPresetOverrideBodyClass = (
	panel: PresetPanelOverride
): string => `is-open-blockera-${panel}-navigation-override`;

export const addPresetOverrideBodyClass = (
	panel: PresetPanelOverride
): string => {
	const className = getPresetOverrideBodyClass(panel);
	document.body?.classList?.add(className);
	return className;
};

export const removePresetOverrideBodyClass = (
	panel: PresetPanelOverride
): void => {
	document.body?.classList?.remove(getPresetOverrideBodyClass(panel));
};

export const navigateToGlobalStylesPath = (path: string): void => {
	(
		document.querySelector(
			`button[id="${path}"]`
		) as HTMLButtonElement | null
	)?.click();
};

export const removeBlockeraGlobalStylesUiBodyClass = (
	className: string = BLOCKERA_GLOBAL_STYLES_UI_BODY_CLASS
): void => {
	document.body?.classList?.remove(className);
	document.body?.removeAttribute('data-test');
};
