// @flow

/**
 * Internal dependencies
 */
import {
	VARIATION_SURFACE_SIZE,
	VARIATION_SURFACE_STYLE,
} from '../../editor/global-styles/panel/variation-surfaces';

export const INSPECTOR_UI_CONTEXT = 'block-inspector';
export const GLOBAL_STYLES_UI_CONTEXT_PREFIX = 'global-styles';

export const GLOBAL_STYLES_STYLE_UI_CONTEXT = `${GLOBAL_STYLES_UI_CONTEXT_PREFIX}-${VARIATION_SURFACE_STYLE}`;
export const GLOBAL_STYLES_SIZE_UI_CONTEXT = `${GLOBAL_STYLES_UI_CONTEXT_PREFIX}-${VARIATION_SURFACE_SIZE}`;

export const GLOBAL_STYLES_EXTENSION_UI_CONTEXTS: Array<string> = [
	GLOBAL_STYLES_STYLE_UI_CONTEXT,
	GLOBAL_STYLES_SIZE_UI_CONTEXT,
];

/**
 * Resolves the extensions UI context key used to isolate editor state (e.g. inner-block target).
 *
 * @param {boolean} insideBlockInspector Whether the block UI is rendered in the block inspector.
 * @param {string} [variationSurface] Active global-styles variation surface (`style` or `size`).
 * @return {string|void} Scoped context key, or undefined for the legacy inspector/global singleton.
 */
export const getExtensionsUiContext = (
	insideBlockInspector: boolean,
	variationSurface?: string
): string | void => {
	if (insideBlockInspector) {
		return undefined;
	}

	return `${GLOBAL_STYLES_UI_CONTEXT_PREFIX}-${
		variationSurface || VARIATION_SURFACE_STYLE
	}`;
};
