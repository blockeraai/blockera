// @flow

/**
 * External dependencies
 */
import { useContext, useSyncExternalStore } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { GlobalStylesPanelActiveColorStoreContext } from './context';
import { createGlobalStylesPanelActiveColorStore } from './global-styles-panel-active-color-store';

const FALLBACK_ACTIVE_COLOR_STORE = createGlobalStylesPanelActiveColorStore();

/**
 * Read popover active-color CSS variables for the current global-styles panel App.
 *
 * Resolution runs once in {@see GlobalStylesPanelActiveColorShell}; this hook
 * only subscribes to that snapshot so BlockStyles / StyleItemMenu re-renders
 * do not re-run {@see useBlockeraActiveColor}.
 *
 * Prefer relying on {@see PopoverActiveColorStyleProvider} from the shell when
 * using `@blockera/controls` `Popover` without an explicit `style` prop.
 *
 * @return {Object} React style object with Blockera CSS custom properties.
 */
export function useGlobalStylesPanelActiveColorStyle(): Object {
	const store =
		useContext(GlobalStylesPanelActiveColorStoreContext) ||
		FALLBACK_ACTIVE_COLOR_STORE;
	return useSyncExternalStore(store.subscribe, store.getSnapshot);
}
