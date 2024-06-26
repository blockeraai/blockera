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
import { store as controlStore } from '../store';
import {
	store as repeaterStore,
	STORE_NAME as repeaterControlStoreName,
} from '../libs/repeater-control/store';

//Register control into store to use in control context provider
export function registerControl({
	name,
	type: STORE_NAME,
	...control
}): Object | undefined {
	if (!isString(name)) {
		return;
	}

	//get `publisher-core/controls` store or details of that
	const { getControl } =
		repeaterControlStoreName === STORE_NAME
			? select(repeaterStore)
			: select(controlStore);

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

	//get `addControl` of `publisher-core/controls` || `publisher-core/controls/repeater` store dispatchers
	const { addControl } =
		repeaterControlStoreName === STORE_NAME
			? dispatch(repeaterStore)
			: dispatch(controlStore);

	//fire add control action
	addControl({ name, ..._control });

	//retrieved control information ✅
	return getControl(name);
}
