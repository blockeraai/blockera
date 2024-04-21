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
import { store as controlStore } from '../store';
import {
	store as repeaterStore,
	STORE_NAME as repeaterControlStoreName,
} from '../libs/repeater-control/store';
import type { ControlRegistrationProps } from './types';

//Register control into store to use in control context provider
export function registerControl({
	name,
	type: STORE_NAME,
	...control
}: ControlRegistrationProps): Object | void {
	if (!isString(name)) {
		return;
	}

	//get `blockera-core/controls` store or details of that
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

	//get `addControl` of `blockera-core/controls` || `blockera-core/controls/repeater` store dispatchers
	const { addControl } =
		repeaterControlStoreName === STORE_NAME
			? dispatch(repeaterStore)
			: dispatch(controlStore);

	//fire add control action
	addControl({ name, ..._control });

	//retrieved control information ✅
	return getControl(name);
}

export function unregisterControl(names: Array<string>, store: string): void {
	//get `addControl` of `blockera-core/controls` || `blockera-core/controls/repeater` store dispatchers
	const { removeControl } =
		repeaterControlStoreName === store
			? dispatch(repeaterStore)
			: dispatch(controlStore);

	removeControl(names);
}
