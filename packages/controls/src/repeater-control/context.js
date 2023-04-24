/**
 * WordPress dependencies
 */
import { createContext } from '@wordpress/element';

const RepeaterContext = createContext({
	clientId: null,
	attributes: {},
	initialState: {},
	repeaterItems: {},
	addNewItem: () => {},
	removeItem: () => {},
	changeItem: () => {},
	InnerComponents: null,
});

const RepeaterContextProvider = ({ children, ...props }) => {
	return (
		<RepeaterContext.Provider value={props}>
			{children}
		</RepeaterContext.Provider>
	);
};

export { RepeaterContext, RepeaterContextProvider };
