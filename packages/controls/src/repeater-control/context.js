/**
 * WordPress dependencies
 */
import { createContext } from '@wordpress/element';

const RepeaterContext = createContext({
	design: 'minimal',
	popoverLabel: '',
	Header: null,
	clientId: null,
	attributes: {},
	initialState: {},
	repeaterItems: {},
	cloneItem: () => {},
	addNewItem: () => {},
	removeItem: () => {},
	changeItem: () => {},
	InnerComponents: null,
	isPopover: true,
});

const RepeaterContextProvider = ({ children, ...props }) => {
	return (
		<RepeaterContext.Provider value={props}>
			{children}
		</RepeaterContext.Provider>
	);
};

export { RepeaterContext, RepeaterContextProvider };
