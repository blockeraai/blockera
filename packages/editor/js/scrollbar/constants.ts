import type { OverlayScrollbarsOptions } from './useScrollbar';

/**
 * Default scrollbar options for block editor elements.
 */
export const defaultScrollbarOptions: OverlayScrollbarsOptions = {
	scrollbars: {
		theme: 'os-theme-dark',
		autoHide: 'move',
		autoHideDelay: 400,
		dragScrolling: true,
		touchSupport: true,
	},
};
