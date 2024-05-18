// @flow

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
} from '../';

/**
 * Internal dependencies
 */
export * from './api';
export * from './libs';
export {
	default as applyHooks,
	withBlockSettings,
	BlockEditContext,
	useBlockContext,
	BlockEditContextProvider,
} from './hooks';
export { store as extensionsStore } from './store';
import bootstrapScripts from './scripts';
export { isInnerBlock } from './components';

export const defineGlobalProps = (): void => {
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

			bootstrapScripts(window.wp);
		}
	});
};
