/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Publisher dependencies
 */
import { reregistrationBlocks } from '@publisher/blocks';

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

	addFilter(
		'blocks.registerBlockType',
		'publisher/core/extensions/withAdvancedControlsAttributes',
		withBlockSettings
	);
}
export { default as withBlockSettings } from './block-settings';

export { useAttributes } from './use-attributes';
export { useIconEffect } from './use-icon-effect';
export { useBlocksStore } from './use-blocks-store';
export { useStoreSelectors } from './use-store-selectors';
export { useBlockExtensions } from './use-block-extensions';
export { useInnerBlocksInfo } from './use-inner-blocks-info';
export { useStoreDispatchers } from './use-store-dispatchers';
export { useBlockSideEffects } from './use-block-side-effects';
export { useDisplayBlockControls } from './use-display-block-controls';
export { useCalculateCurrentAttributes } from './use-calculate-current-attributes';
