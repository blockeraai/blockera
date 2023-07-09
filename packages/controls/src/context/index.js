/**
 * External dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { createContext, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { registerControl } from '../api';
import { STORE_NAME } from '../store/constants';
import { isFunction } from '@publisher/utils';

export const ControlContext = createContext({
	controlInfo: {
		name: null,
		value: null,
		onChange: () => null,
	},
	value: null,
	dispatch: () => null,
});

export const ControlContextProvider = ({ value: controlInfo, children }) => {
	//Prepare control status and value!
	const { status, value, onChange, valueCleanUp } = useSelect(
		(select) => {
			registerControl(controlInfo);

			const { getControl } = select(STORE_NAME);

			return getControl(controlInfo.name);
		},
		[controlInfo]
	);
	//control dispatch for available actions
	const dispatch = useDispatch(STORE_NAME);

	useEffect(() => {
		return isFunction(onChange) && isFunction(valueCleanUp)
			? onChange(valueCleanUp(value))
			: onChange(value);
		// eslint-disable-next-line
	}, [value]);

	//You can to enable||disable current control with status column!
	if (!status) {
		return null;
	}

	return (
		<ControlContext.Provider value={{ controlInfo, value, dispatch }}>
			{children}
		</ControlContext.Provider>
	);
};

export * from './hooks';
