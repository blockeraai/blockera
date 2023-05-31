/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import withEditorProps from './editor-props';
import withBlockSettings from './block-settings';
// import withSaveProps from './save-props';
// import withBlockControls from './block-controls';
// import withCustomizeSaveElement from './save-element';

export { BlockEditContext, BlockEditContextProvider } from './context';

export default function applyHooks() {
	addFilter(
		'blocks.registerBlockType',
		'publisher/core/extensions/withAdvancedControlsAttributes',
		withBlockSettings
	);
	// addFilter(
	// 	'editor.BlockEdit',
	// 	'publisher/core/extensions/withAdvancedBlockEditControls',
	// 	withBlockControls
	// );
	addFilter(
		'editor.BlockListBlock',
		'publisher/core/extensions/withAppliedEditorProps',
		withEditorProps
	);
	// addFilter(
	// 	'blocks.getSaveContent.extraProps',
	// 	'publisher/core/extensions/withAppliedExtraSaveProps',
	// 	withSaveProps
	// );
	// addFilter(
	// 	'blocks.getSaveElement',
	// 	'publisher/core/extensions/withAppliedCustomizeSaveElement',
	// 	withCustomizeSaveElement
	// );
}
