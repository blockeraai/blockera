// @flow
/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import withBlockSettings from './block-settings';

export {
	useBlockContext,
	BlockEditContext,
	BlockEditContextProvider,
} from './context';

export default function applyHooks(beforeApplyHooks: () => void) {
	if ('function' === typeof beforeApplyHooks) {
		beforeApplyHooks();
	}

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
