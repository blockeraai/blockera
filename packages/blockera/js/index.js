// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import {
	reregistrationBlocks,
	registerThirdPartyExtensionDefinitions,
} from '@blockera/blocks';
import { initializer } from '@blockera/bootstrap';
import { applyHooks, defineGlobalProps } from '@blockera/editor';

/**
 * Initialize blockera react application.
 */
addFilter('blockera.bootstrapper', 'blockera.bootstrap', () => {
	defineGlobalProps();

	applyHooks(() => {
		reregistrationBlocks();
		registerThirdPartyExtensionDefinitions();
	});
});

initializer();
