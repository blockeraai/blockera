/**
 * External dependencies
 */
import { createContext, useContext } from '@wordpress/element';
import { useDispatch, select } from '@wordpress/data';

/**
 * Publisher dependencies
 */
import { BlockEditContext } from '@publisher/extensions';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store';
import { registerControl } from '../api';

export const ControlContext = createContext({
	controlInfo: {
		name: null,
		value: null,
	},
	value: null,
	dispatch: null,
});

export const ControlContextProvider = ({
	value: controlInfo,
	children,
	storeName = STORE_NAME,
	...props
}) => {
	registerControl({
		...controlInfo,
		type: storeName,
	});

	const { getControl } = select(storeName);

	//Prepare control status and value!
	const { status, value } = getControl(controlInfo.name);

	//control dispatch for available actions
	const dispatch = useDispatch(storeName);
	// get block clientId
	const { clientId } = useContext(BlockEditContext);

	//You can to enable||disable current control with status column!
	if (!status) {
		return null;
	}

	return (
		<ControlContext.Provider
			{...props}
			value={{ controlInfo, value, dispatch, key: clientId }}
		>
			{children}
		</ControlContext.Provider>
	);
};

export * from './hooks';
