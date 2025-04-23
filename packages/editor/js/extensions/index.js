// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import {
	store,
	unstableBootstrapServerSideEntities,
	unstableBootstrapServerSideVariableDefinitions,
	unstableBootstrapServerSideDynamicValueDefinitions,
} from '@blockera/data';
import {
	store as editorStore,
	registerCanvasEditorSettings,
	unstableBootstrapServerSideBreakpointDefinitions,
	unstableBootstrapServerSideBlockStatesDefinitions,
} from '../';

/**
 * Internal dependencies
 */
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
	const packageName =
		'blockeraEditor_' +
		blockeraEditorPackageInfo.version.replace(/\./g, '_');

	window[packageName].coreData = {
		select: select(store?.name),
		unstableBootstrapServerSideEntities,
		unstableBootstrapServerSideVariableDefinitions,
		unstableBootstrapServerSideBlockStatesDefinitions,
		unstableBootstrapServerSideDynamicValueDefinitions,
	};

	window[packageName].editor = {
		...(window[packageName]?.editor || {}),
		init: outsideDefinitions,
		select: select(editorStore?.name),
		unstableBootstrapServerSideBreakpointDefinitions,
		unstableBootstrapServerSideBlockStatesDefinitions,
	};

	registerCanvasEditorSettings({
		zoom: '100%',
		width: '100%',
		height: '100%',
		isOpenSettings: false,
		isOpenOtherBreakpoints: false,
	});
};
