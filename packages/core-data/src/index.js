// @flow
/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { STORE_NAME } from './store';

export function unstableBootstrapServerSideDynamicValueDefinitions(
	definitions
) {
	const { addBootstrappedDynamicValueGroup } = dispatch(STORE_NAME);

	for (const [name, dynamicValueGroup] of Object.entries(definitions)) {
		addBootstrappedDynamicValueGroup({ name, dynamicValueGroup });
	}
}

export function unstableBootstrapServerSideVariableDefinitions(definitions) {
	const { addBootstrappedVariableGroup } = dispatch(STORE_NAME);

	for (const [name, variableGroup] of Object.entries(definitions)) {
		addBootstrappedVariableGroup({ name, variableGroup });
	}
}

export * from './store';
export * from './types';
export * from './selectors';
