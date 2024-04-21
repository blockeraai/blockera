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
	unstableBootstrapServerSideDynamicValueDefinitions,
} from '@blockera/core-data';
import {
	store as editorStore,
	registerCanvasEditorSettings,
	unstableBootstrapServerSideBreakpointDefinitions,
} from '@blockera/editor';

/**
 * Internal dependencies
 */
import bootstrapScripts from './scripts';
//TODO: replace with unstable server side breakpoints.
import defaultBreakpoints from './libs/block-states/default-breakpoints';

export { isInnerBlock } from './components';
export { store } from './store';
export * from './api';
export * from './libs';
export {
	default as applyHooks,
	withBlockSettings,
	BlockEditContext,
	BlockEditContextProvider,
} from './hooks';

domReady(() => {
	if (window?.wp) {
		window.blockera.coreData = {
			select: select(store?.name),
			unstableBootstrapServerSideEntities,
			unstableBootstrapServerSideVariableDefinitions,
			unstableBootstrapServerSideDynamicValueDefinitions,
		};

		window.blockera.editor = {
			select: select(editorStore?.name),
			unstableBootstrapServerSideBreakpointDefinitions,
		};

		//TODO: after server side breakpoints please remove this statement.
		unstableBootstrapServerSideBreakpointDefinitions(defaultBreakpoints());

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
