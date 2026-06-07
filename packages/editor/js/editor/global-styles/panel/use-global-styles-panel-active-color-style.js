// @flow

/**
 * Internal dependencies
 */
import { useBlockeraPopoverActiveColorStyle } from '../../../extensions/components/use-blockera-popover-active-color-style';
import { useGlobalStylesPanelContext } from './context';

/**
 * Global-styles popover colors — panel context overrides store defaults
 * (fallback client id, variation surface, unsaved state data).
 *
 * @param {string} blockName Registered block type name.
 * @return {Object} React style object with Blockera CSS custom properties.
 */
export function useGlobalStylesPanelActiveColorStyle(
	blockName: string
): Object {
	const { fallbackClientId, variationSurface, style } =
		useGlobalStylesPanelContext();

	return useBlockeraPopoverActiveColorStyle({
		name: blockName,
		clientId: fallbackClientId,
		variationSurface,
		blockeraUnsavedData: style?.blockeraUnsavedData,
	});
}
