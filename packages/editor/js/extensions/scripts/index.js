// @flow

/**
 * Blockera dependencies
 */
import { blockeraBootstrapControls } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { blockeraExtensionsBootstrap } from '../libs/bootstrap';

export default function () {
	// Bootstrap functions for extensions.
	blockeraExtensionsBootstrap();

	// Bootstrap functions for controls.
	blockeraBootstrapControls();
}
