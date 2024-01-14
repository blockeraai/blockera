/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';

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
export { useStoreDispatchers } from './use-store-dispatchers';
export { useDisplayBlockControls } from './use-display-block-controls';
