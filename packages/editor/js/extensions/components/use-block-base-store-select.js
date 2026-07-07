// @flow

/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getBaseBreakpoint } from '../../editor/header-ui/components/breakpoints/helpers';
import { useGlobalStylesPanelContext } from '../../editor/global-styles/panel/context';

/**
 * Blockera/extension store slice for BlockBase.
 *
 * When the block is not selected, skips global extension fields (current inner
 * target, breakpoint, editor events) so inserter hover and other editor-wide
 * UI does not re-render every BlockBase instance.
 *
 * @param {Object}  options
 * @param {string}  options.clientId
 * @param {string}  options.name
 * @param {boolean} options.isSelected
 * @param {boolean} [options.insideBlockInspector=true]
 */
export function useBlockBaseStoreSelect({
	clientId,
	name,
	isSelected,
	insideBlockInspector = true,
}: {
	clientId: string,
	name: string,
	isSelected: boolean,
	insideBlockInspector?: boolean,
}): Object {
	// Global styles panel mounts a single BlockBase (insideBlockInspector=false) without
	// isSelected; it must still read extension inner-block target from the store.
	const effectivelySelected = isSelected || !insideBlockInspector;
	const { extensionsUiContext: panelExtensionsUiContext } =
		useGlobalStylesPanelContext();
	const extensionsUiContext =
		effectivelySelected && !insideBlockInspector
			? panelExtensionsUiContext
			: undefined;

	return useSelect(
		(select) => {
			const {
				getBlockExtensionBy,
				getActiveInnerState,
				getActiveMasterState,
				getExtensionCurrentBlock,
				getExtensionCurrentBlockStateBreakpoint,
			} = select('blockera/extensions');

			const { getActiveBlockVariation: _getActiveBlockVariation } =
				select('blockera/extensions');
			const {
				getBlockType,
				getActiveBlockVariation,
				getBlockVariations,
			} = select('core/blocks');
			const { getBlockAttributes } = select('core/block-editor');
			const { getDeviceType, getEditorSelectedBlockEvent } =
				select('blockera/editor');

			const currentBlock = effectivelySelected
				? getExtensionCurrentBlock(extensionsUiContext)
				: 'master';
			const currentBreakpoint = effectivelySelected
				? getExtensionCurrentBlockStateBreakpoint()
				: getBaseBreakpoint();
			const editorSelectedBlockEvent = effectivelySelected
				? getEditorSelectedBlockEvent()
				: undefined;

			const {
				supports,
				selectors,
				attributes: availableAttributes,
			} = getBlockType(name);

			return {
				getDeviceType,
				currentBlock,
				getBlockExtensionBy,
				currentState: getActiveMasterState(clientId, name),
				currentBreakpoint,
				currentInnerBlockState: effectivelySelected
					? getActiveInnerState(clientId, currentBlock)
					: 'normal',
				supports,
				selectors,
				availableAttributes,
				getActiveBlockVariation,
				editorSelectedBlockEvent,
				activeBlockVariation: getActiveBlockVariation(
					name,
					getBlockAttributes(clientId) || {}
				),
				blockVariations: name && getBlockVariations(name, 'transform'),
				activeVariation: _getActiveBlockVariation(),
			};
		},
		[clientId, name, effectivelySelected, extensionsUiContext]
	);
}
