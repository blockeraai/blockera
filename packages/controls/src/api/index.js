/**
 * External dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Publisher dependencies
 */
import { isString } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { store } from '../store';

//Register control into store to use in control context provider
export function registerControl({ name, ...control }): Object | undefined {
	if (!isString(name)) {
		return;
	}

	//get `publisher-core/controls` store or details of that
	const { getControl } = select(store);

	//Check is registered control or not!
	if (getControl(name)) {
		return;
	}

	//Create control schema
	const _control = {
		name,
		value: null,
		status: true,
		onChange: () => null,
		...control,
	};

	//get `addControl` of `publisher-core/controls` store dispatchers
	const { addControl } = dispatch(store);

	//fire add control action
	addControl({ name, ..._control });

	//retrieved control information ✅
	return getControl(name);
}
