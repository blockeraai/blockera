// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { createContext } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store';
import { registerControl } from '../api';
import type { ControlContextProviderProps } from './types';

export const ControlContext: Object = createContext({
	controlInfo: {
		name: null,
		value: null,
		attribute: null,
		blockName: null,
		description: null,
	},
	value: null,
	dispatch: null,
});

export const ControlContextProvider = ({
	value: controlInfo,
	children,
	storeName = STORE_NAME,
	...props
}: ControlContextProviderProps): MixedElement | null => {
	// $FlowFixMe
	registerControl({
		...controlInfo,
		type: storeName,
	});

	//Prepare control status and value!
	const { status, value } = useSelect(
		(select) => {
			const { getControl } = select(storeName);

			return getControl(controlInfo.name);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[controlInfo]
	);
	//control dispatch for available actions
	const dispatch = useDispatch(storeName);

	//You can to enable||disable current control with status column!
	if (!status) {
		return null;
	}

	return (
		<ControlContext.Provider
			{...props}
			value={{ controlInfo, value, dispatch }}
		>
			{children}
		</ControlContext.Provider>
	);
};

export { useControlContext, useControlEffect } from './hooks';
