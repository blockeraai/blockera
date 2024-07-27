// @flow

/**
 * External dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import {
	reregistrationBlocks,
	blockeraBootstrapBlocks,
	registerThirdPartyExtensionDefinitions,
} from '@blockera/blocks-core';
import { noop } from '@blockera/utils';
import { initializer } from '@blockera/bootstrap';
import {
	applyHooks,
	defineGlobalProps,
	bootstrapCanvasEditor,
	blockeraExtensionsBootstrap,
} from '@blockera/editor';

/**
 * Registration blockera core block settings with internal definitions.
 */
addFilter('blockera.bootstrapper.before.domReady', 'blockera.bootstrap', () => {
	applyHooks(() => {
		reregistrationBlocks();
		registerThirdPartyExtensionDefinitions();
	});
});

/**
 * Initialize blockera react application.
 */
addFilter('blockera.bootstrapper', 'blockera.bootstrap', () => {
	applyFilters('blockera.before.bootstrap', noop)();

	return () => {
		defineGlobalProps(() => {
			// Bootstrap functions for blocks.
			blockeraBootstrapBlocks();

			// Bootstrap canvas editor UI.
			bootstrapCanvasEditor();

			// Bootstrap functions for extensions.
			blockeraExtensionsBootstrap();
		});
	};
});

initializer();
