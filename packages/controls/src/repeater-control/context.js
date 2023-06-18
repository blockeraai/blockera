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
	initValue: {},
	repeaterItems: {},
	maxItems: -1,
	repeaterItemsPopoverClassName: '',
	cloneItem: () => {},
	addNewItem: () => {},
	removeItem: () => {},
	changeItem: () => {},
	InnerComponents: null,
	isPopover: true,
	customProps: {},
});

const RepeaterContextProvider = ({ children, ...props }) => {
	return (
		<RepeaterContext.Provider value={props}>
			{children}
		</RepeaterContext.Provider>
	);
};

export { RepeaterContext, RepeaterContextProvider };
