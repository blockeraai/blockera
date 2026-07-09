export const BLOCKERA_CLEANUP_SCREEN_STYLES_CLASS =
	'blockera-cleanup-screen-styles';

export const BLOCKERA_COLORS_PRESET_INSPECTOR_ACTIVE_CLASS =
	'blockera-colors-preset-inspector-active';

export const BLOCKERA_FONT_SIZE_PRESET_INSPECTOR_ACTIVE_CLASS =
	'blockera-font-size-preset-inspector-active';

export const BLOCKERA_LINE_HEIGHT_PRESET_INSPECTOR_ACTIVE_CLASS =
	'blockera-line-height-preset-inspector-active';

export const BLOCKERA_SHADOWS_PRESET_INSPECTOR_ACTIVE_CLASS =
	'blockera-shadows-preset-inspector-active';

export const enablePresetInspectorCleanup = (
	inspectorActiveClass: string,
	event?: Event,
	contentSelector?: string
): void => {
	document.body.classList.add(BLOCKERA_CLEANUP_SCREEN_STYLES_CLASS);
	markPresetInspectorActive(inspectorActiveClass, event, contentSelector);
};

export const disablePresetInspectorCleanup = (
	inspectorActiveClass: string
): void => {
	document.body.classList.remove(BLOCKERA_CLEANUP_SCREEN_STYLES_CLASS);

	const parent = document.querySelector(`.${inspectorActiveClass}`);

	if (parent instanceof HTMLElement) {
		parent.classList.remove(inspectorActiveClass);
	}
};

export const markPresetInspectorActive = (
	inspectorActiveClass: string,
	event?: Event,
	contentSelector?: string
): void => {
	if (event) {
		const inspectorWrapper = (event.target as HTMLElement)?.closest(
			'.blockera-block-inspector-controls-wrapper'
		);

		if (inspectorWrapper?.parentElement) {
			inspectorWrapper.parentElement.classList.add(inspectorActiveClass);
			return;
		}
	}

	if (!contentSelector) {
		return;
	}

	const content = document.querySelector(contentSelector);

	if (!(content instanceof HTMLElement)) {
		return;
	}

	const parent = content.parentElement;

	if (parent instanceof HTMLElement) {
		parent.classList.add(inspectorActiveClass);
	}
};
