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
import bootstrapScripts from './scripts';
import blockeraEditorPackageInfo from '../../../editor/package.json';

// Exports
export * from './api';
export * from './libs';
export {
	default as applyHooks,
	withBlockSettings,
	BlockEditContext,
	useBlockContext,
	BlockEditContextProvider,
} from './hooks';
export { isInnerBlock } from './components';
export { store as extensionsStore } from './store';

export const defineGlobalProps = (outsideDefinitions?: () => void): void => {
	domReady(() => {
		const packageName =
			'blockeraEditor_' +
			blockeraEditorPackageInfo.version.replace(/\./g, '_');

		if (window?.wp) {
			window[packageName].coreData = {
				select: select(store?.name),
				unstableBootstrapServerSideEntities,
				unstableBootstrapServerSideVariableDefinitions,
			};

			window[packageName].editor = {
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

			if ('function' === typeof outsideDefinitions) {
				outsideDefinitions();
			}
		}
	});
};
