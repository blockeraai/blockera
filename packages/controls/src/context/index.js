/**
 * External dependencies
 */
import { createContext } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store';
import { registerControl } from '../api';

export const ControlContext = createContext({
	controlInfo: {
		name: null,
		value: null,
		onChange: null,
	},
	value: null,
	dispatch: null,
});

export const ControlContextProvider = ({
	value: controlInfo,
	children,
	storeName = STORE_NAME,
}) => {
	//Prepare control status and value!
	const { status, value, onChange } = useSelect(
		(select) => {
			registerControl({
				...controlInfo,
				type: storeName,
			});

			const { getControl } = select(storeName);

			return getControl(controlInfo.name);
		},
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
			value={{ controlInfo, value, onChange, dispatch }}
		>
			{children}
		</ControlContext.Provider>
	);
};

export * from './hooks';
