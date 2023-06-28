/**
 * WordPress dependencies
 */
import { createContext } from '@wordpress/element';

const RepeaterContext = createContext({
	design: 'minimal',
	isPopover: true,
	popoverLabel: '',
	popoverClassName: '',
	maxItems: -1,
	minItems: 0,
	actionButtonAdd: true,
	actionButtonVisibility: true,
	actionButtonDelete: true,
	actionButtonClone: true,
	injectHeaderButtonsStart: '',
	injectHeaderButtonsEnd: '',
	//
	repeaterItemHeader: null,
	repeaterItemChildren: null,
	//
	attributes: {},
	defaultValue: {},
	repeaterItems: {}, // value
	//
	customProps: {}, // we use this for passing props from out of RepeaterControl to RepeaterItemHeader and RepeaterItemChildren
	//
	cloneItem: () => {},
	addNewItem: () => {},
	removeItem: () => {},
	changeItem: () => {},
});

const RepeaterContextProvider = ({ children, ...props }) => {
	return (
		<RepeaterContext.Provider value={props}>
			{children}
		</RepeaterContext.Provider>
	);
};

export { RepeaterContext, RepeaterContextProvider };
