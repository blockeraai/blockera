/**
 * WordPress dependencies
 */
import { useElementsScrollbar } from './useElementsScrollbar';
import type { BlockEditorScrollbarTarget } from './useElementsScrollbar';
import { defaultScrollbarOptions } from './constants';

/**
 * Default block editor scrollbar targets.
 * These are common elements in the WordPress block editor that benefit from custom scrollbars.
 */
const defaultBlockEditorScrollbarTargets: BlockEditorScrollbarTarget[] = [
	// Right side bar for block editor
	{
		selector: '.interface-complementary-area.editor-sidebar',
		options: defaultScrollbarOptions,
	},
	// Global styles sidebar
	{
		selector: '.interface-complementary-area.edit-site-global-styles-sidebar',
		options: defaultScrollbarOptions,
	},
];

/**
 * Component that initializes OverlayScrollbars for default block editor elements.
 * This component should be rendered once at the root level of the plugin.
 */
export default function BlockEditorScrollbars(): null {
	useElementsScrollbar(defaultBlockEditorScrollbarTargets, true);

	return null;
}
