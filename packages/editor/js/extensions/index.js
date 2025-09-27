// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import {
	store as editorStore,
	registerCanvasEditorSettings,
	unstableBootstrapServerSideBreakpointDefinitions,
} from '../';

/**
 * Internal dependencies
 */
import blockeraEditorPackageInfo from '../../../editor/package.json';
import {
	generalBlockStates,
	generalInnerBlockStates,
	unstableBootstrapBlockStatesDefinitions,
	unstableBootstrapInnerBlockStatesDefinitions,
} from './libs';

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
export { isInnerBlock, bootstrapBlockAppSettings } from './components';
export { store as extensionsStore } from './store';

export const defineGlobalProps = (outsideDefinitions?: () => void): void => {
	const packageName =
		'blockeraEditor_' +
		blockeraEditorPackageInfo.version.replace(/\./g, '_');

	unstableBootstrapBlockStatesDefinitions(generalBlockStates);
	unstableBootstrapInnerBlockStatesDefinitions(generalInnerBlockStates);

	window[packageName].editor = {
		...(window[packageName]?.editor || {}),
		init: outsideDefinitions,
		select: select(editorStore?.name),
		unstableBootstrapServerSideBreakpointDefinitions,
		unstableBootstrapBlockStatesDefinitions,
	};

	registerCanvasEditorSettings({
		zoom: '100%',
		width: '100%',
		height: '100%',
		isOpenSettings: false,
		isOpenOtherBreakpoints: false,
	});
};
