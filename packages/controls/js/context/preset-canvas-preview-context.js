// @flow

/**
 * External dependencies
 */
import { createContext, useContext } from '@wordpress/element';

export type PresetCanvasPreviewValue = {|
	setPreviewAttributePatch: (patch: Object | null) => void,
	/** Ensures blockeraPropsId and blockera className on the block when hovering preset rows. */
	primePresetHover: () => void,
|};

/**
 * From BlockBase: preset row hover merges a partial attribute patch into BlockStyle props;
 * primePresetHover updates the block in the editor store (id / className) when needed.
 * Raw declaration strings (gradients) use PreviewInjectableStylesContext instead.
 */
export const PresetCanvasPreviewContext: Object =
	createContext<?PresetCanvasPreviewValue>(null);

/**
 * @return {?PresetCanvasPreviewValue} API or null outside BlockBase preset preview provider.
 */
export function usePresetCanvasPreview(): ?PresetCanvasPreviewValue {
	return useContext(PresetCanvasPreviewContext);
}
