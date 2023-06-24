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
	defaultValue: {},
	repeaterItems: {},
	maxItems: -1,
	minItems: -1,
	visibilityControl: true,
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
