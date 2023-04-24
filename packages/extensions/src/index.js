/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import {
	withSaveProps,
	withEditorProps,
	withBlockControls,
	withBlockAttributes,
} from './wrappers';

export default function activateExtensions() {
	addFilter(
		'blocks.registerBlockType',
		'publisher/core/extensions/withAdvancedControlsAttributes',
		withBlockAttributes
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

	// addFilter(
	// 	'blocks.getSaveElement',
	// 	'publisher/core/extensions/withAppliedCustomizeSaveElement',
	// 	withCustomizeSaveElement
	// );
}
