/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import domReady from '@wordpress/dom-ready';

/**
 * Publisher dependencies
 */
import {
	store,
	unstableBootstrapServerSideVariableDefinitions,
	unstableBootstrapServerSideDynamicValueDefinitions,
} from '@publisher/core-data';

/**
 * Internal dependencies
 */
import bootstrapScripts from './scripts';

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
		window.publisher.coreData = {
			select: select(store?.name),
			unstableBootstrapServerSideVariableDefinitions,
			unstableBootstrapServerSideDynamicValueDefinitions,
		};

		bootstrapScripts(window.wp, window.React);
	}
});
