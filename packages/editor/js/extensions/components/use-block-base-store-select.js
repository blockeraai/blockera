// @flow

/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getBaseBreakpoint } from '../../editor/header-ui/components/breakpoints/helpers';

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
 */
export function useBlockBaseStoreSelect({
	clientId,
	name,
	isSelected,
}: {
	clientId: string,
	name: string,
	isSelected: boolean,
}): Object {
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

			const currentBlock = isSelected
				? getExtensionCurrentBlock()
				: 'master';
			const currentBreakpoint = isSelected
				? getExtensionCurrentBlockStateBreakpoint()
				: getBaseBreakpoint();
			const editorSelectedBlockEvent = isSelected
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
				currentInnerBlockState: isSelected
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
		[clientId, name, isSelected]
	);
}
