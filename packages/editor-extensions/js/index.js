/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import domReady from '@wordpress/dom-ready';

/**
 * Blockera dependencies
 */
import {
	store,
	unstableBootstrapServerSideEntities,
	unstableBootstrapServerSideVariableDefinitions,
} from '@blockera/data';
import {
	store as editorStore,
	registerCanvasEditorSettings,
	unstableBootstrapServerSideBreakpointDefinitions,
} from '@blockera/editor';

/**
 * Internal dependencies
 */
export * from './api';
export * from './libs';
export {
	default as applyHooks,
	withBlockSettings,
	BlockEditContext,
	BlockEditContextProvider,
} from './hooks';
export { store } from './store';
import bootstrapScripts from './scripts';
export { isInnerBlock } from './components';

domReady(() => {
	if (window?.wp) {
		window.blockera.coreData = {
			select: select(store?.name),
			unstableBootstrapServerSideEntities,
			unstableBootstrapServerSideVariableDefinitions,
		};

		window.blockera.editor = {
			select: select(editorStore?.name),
			unstableBootstrapServerSideBreakpointDefinitions,
		};

		registerCanvasEditorSettings({
			zoom: '100%',
			width: '100%',
			height: '100%',
			isOpenSettings: false,
			isOpenOtherBreakpoints: false,
		});

		bootstrapScripts(window.wp, window.React);
	}
});
