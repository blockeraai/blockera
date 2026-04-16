// @flow

/**
 * External dependencies
 */
import { createContext, useContext } from '@wordpress/element';

export type PresetCanvasPreviewValue = {|
	setPreviewAttributePatch: (patch: Object | null) => void,
|};

/**
 * From BlockBase: preset row hover merges a partial attribute patch into a second BlockStyle
 * so StateStyle generates canvas preview CSS. Raw declaration strings (gradients) use
 * PreviewInjectableStylesContext instead.
 */
export const PresetCanvasPreviewContext: Object =
	createContext<?PresetCanvasPreviewValue>(null);

/**
 * @return {?PresetCanvasPreviewValue} API or null outside BlockBase preset preview provider.
 */
export function usePresetCanvasPreview(): ?PresetCanvasPreviewValue {
	return useContext(PresetCanvasPreviewContext);
}
