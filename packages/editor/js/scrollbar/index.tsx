/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal dependencies
 */
import { default as BlockEditorScrollbars } from './BlockEditorScrollbars';

registerPlugin('blockera-scrollbar', {
	render: () => (
		<>
			<BlockEditorScrollbars />
		</>
	),
	icon: null,
});

export { useScrollbar, type OverlayScrollbarsOptions } from './useScrollbar';
export {
	useElementsScrollbar,
	type BlockEditorScrollbarTarget,
} from './useElementsScrollbar';
export { default as BlockEditorScrollbars } from './BlockEditorScrollbars';
export { defaultScrollbarOptions } from './constants';

// Export bootstrap function
export { bootstrapScrollbar } from './bootstrap';
