import withSaveProps from './save-props';
import withEditorProps from './editor-props';
import withBlockControls from './block-controls';
import withBlockSettings from './block-settings';
import withCustomizeSaveElement from './save-element';

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */

export default function applyHooks() {
	addFilter(
		'blocks.registerBlockType',
		'publisher/core/extensions/withAdvancedControlsAttributes',
		withBlockSettings
	);

	addFilter(
		'editor.BlockEdit',
		'publisher/core/extensions/withAdvancedBlockEditControls',
		withBlockControls
	);

	addFilter(
		'editor.BlockListBlock',
		'publisher/core/extensions/withAppliedEditorProps',
		withEditorProps
	);

	addFilter(
		'blocks.getSaveContent.extraProps',
		'publisher/core/extensions/withAppliedExtraSaveProps',
		withSaveProps
	);

	addFilter(
		'blocks.getSaveElement',
		'publisher/core/extensions/withAppliedCustomizeSaveElement',
		withCustomizeSaveElement
	);
}
