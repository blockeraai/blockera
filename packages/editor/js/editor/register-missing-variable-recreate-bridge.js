/**
 * External dependencies
 */
import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal dependencies
 */
import { MissingVariableRecreateBridge } from './missing-variable-recreate-bridge';

/**
 * Registers the missing-variable recreate bridge for post editor sessions.
 */
export function registerMissingVariableRecreateBridge() {
	registerPlugin('blockera-missing-variable-recreate-bridge', {
		render: MissingVariableRecreateBridge,
		icon: null,
	});
}
