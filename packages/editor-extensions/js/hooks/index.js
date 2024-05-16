// @flow
/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import {
	reregistrationBlocks,
	registerThirdPartyExtensionDefinitions,
} from '@blockera/blocks';

/**
 * Internal dependencies
 */
import withBlockSettings from './block-settings';

export {
	useBlockContext,
	BlockEditContext,
	BlockEditContextProvider,
} from './context';

export default function applyHooks() {
	reregistrationBlocks();
	registerThirdPartyExtensionDefinitions();

	const unsupportedBlocks = applyFilters(
		'blockera.editor-extensions.hooks.withBlockSettings.disabledBlocks',
		[]
	);

	addFilter(
		'blocks.registerBlockType',
		'blockera/core/extensions/withAdvancedControlsAttributes',
		(settings: Object, name: Object): Object =>
			withBlockSettings(settings, name, unsupportedBlocks)
	);
}
export { default as withBlockSettings } from './block-settings';

export { useAttributes } from './use-attributes';
export { useBlocksStore } from './use-blocks-store';
export { useStoreSelectors } from './use-store-selectors';
export { useBlockExtensions } from './use-block-extensions';
export { useInnerBlocksInfo } from './use-inner-blocks-info';
export { useStoreDispatchers } from './use-store-dispatchers';
export { useBlockSideEffects } from './use-block-side-effects';
export { useDisplayBlockControls } from './use-display-block-controls';
export { useCalculateCurrentAttributes } from './use-calculate-current-attributes';
