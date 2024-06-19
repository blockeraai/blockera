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
import { applyHooks, defineGlobalProps } from '@blockera/editor';

/**
 * Initialize blockera react application.
 */
addFilter('blockera.bootstrapper', 'blockera.bootstrap', () => {
	applyFilters('blockera.before.bootstrap', noop)();

	defineGlobalProps(() => {
		// Bootstrap functions for blocks.
		blockeraBootstrapBlocks();
	});

	applyHooks(() => {
		reregistrationBlocks();
		registerThirdPartyExtensionDefinitions();
	});
});

initializer();
