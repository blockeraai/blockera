// @flow

/**
 * External dependencies
 */
import { createContext, useContext } from '@wordpress/element';

export type PreviewInjectableStylesValue = {|
	extraPreviewCss: string,
	setExtraPreviewCss: (css: string) => void,
|};

/**
 * When provided from BlockBase (block inspector only), consumers can push extra CSS that is
 * rendered by the block style component (`block-style.js`) alongside block / custom CSS.
 */
export const PreviewInjectableStylesContext: Object =
	createContext<?PreviewInjectableStylesValue>(null);

/**
 * @return {?PreviewInjectableStylesValue} API or null when not under BlockBase preview provider.
 */
export function usePreviewInjectableStyles(): ?PreviewInjectableStylesValue {
	return useContext(PreviewInjectableStylesContext);
}
