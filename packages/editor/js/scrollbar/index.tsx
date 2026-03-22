/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins';

/**
 * OverlayScrollbars base theme (required for `.os-theme-dark` / `.os-scrollbar` layout).
 * @see https://github.com/KingSora/OverlayScrollbars#getting-started
 */
import 'overlayscrollbars/styles/overlayscrollbars.css';
import './style.scss';

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
