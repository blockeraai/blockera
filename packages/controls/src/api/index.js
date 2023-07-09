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

export function registerControl({ name, ...control }): Object | undefined {
	if (!isString(name)) {
		return;
	}

	const { getControl } = select(store);

	if (getControl(name)) {
		return;
	}

	const _control = {
		name,
		value: null,
		status: true,
		onChange: () => null,
		...control,
	};

	const { addControl } = dispatch(store);

	addControl({ name, ..._control });

	return getControl(name);
}
