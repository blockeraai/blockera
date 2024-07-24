// @flow

/**
 * External dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { isString } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { ControlRegistrationProps } from './types';
import { STORE_NAME as CONTROL_STORE_NAME } from '../store/constants';
import { STORE_NAME as REPEATER_CONTROL_STORE_NAME } from '../libs/repeater-control/store/constants';

//Register control into store to use in control context provider
export function registerControl({
	name,
	type: STORE_NAME,
	...control
}: ControlRegistrationProps): Object | void {
	if (!isString(name)) {
		return;
	}

	//get `blockera/controls` store or details of that
	const { getControl } =
		REPEATER_CONTROL_STORE_NAME === STORE_NAME
			? select(REPEATER_CONTROL_STORE_NAME)
			: select(CONTROL_STORE_NAME);

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

	//get `addControl` of `blockera/controls` || `blockera/controls/repeater` store dispatchers
	const { addControl } =
		REPEATER_CONTROL_STORE_NAME === STORE_NAME
			? dispatch(REPEATER_CONTROL_STORE_NAME)
			: dispatch(CONTROL_STORE_NAME);

	//fire add control action
	addControl({ name, ..._control });

	//retrieved control information ✅
	return getControl(name);
}

export function unregisterControl(names: Array<string>, store: string): void {
	//get `addControl` of `blockera/controls` || `blockera/controls/repeater` store dispatchers
	const { removeControl } =
		REPEATER_CONTROL_STORE_NAME === store
			? dispatch(REPEATER_CONTROL_STORE_NAME)
			: dispatch(CONTROL_STORE_NAME);

	removeControl(names);
}
