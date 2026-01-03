/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal dependencies
 */
import { default as BlockEditorScrollbars } from './BlockEditorScrollbars';

/**
 * Scrollbar utilities and hooks for applying OverlayScrollbars.
 */
import './style.css';

// Import OverlayScrollbars CSS
import 'overlayscrollbars/styles/overlayscrollbars.css';

registerPlugin('blockera-scrollbar', {
	render: () => (
		<>
			<BlockEditorScrollbars />
		</>
	),
	icon: null,
});

export { useScrollbar, type OverlayScrollbarsOptions } from './useScrollbar';
export { useElementsScrollbar, type BlockEditorScrollbarTarget } from './useElementsScrollbar';
export { default as BlockEditorScrollbars } from './BlockEditorScrollbars';
export { defaultScrollbarOptions } from './constants';

// Export bootstrap function
export { bootstrapScrollbar } from './bootstrap';
