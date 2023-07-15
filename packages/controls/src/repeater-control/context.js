/**
 * WordPress dependencies
 */
import { createContext } from '@wordpress/element';

const RepeaterContext = createContext({
	design: 'minimal',
	mode: 'popover',
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
	controlId: null,
	repeaterId: null,
	repeaterItemHeader: null,
	repeaterItemChildren: null,
	//
	attributes: {},
	defaultValue: {},
	repeaterItems: {}, // value
	//
	customProps: {}, // we use this for passing props from out of RepeaterControl to RepeaterItemHeader and RepeaterItemChildren
});

const RepeaterContextProvider = ({ children, ...props }) => {
	return (
		<RepeaterContext.Provider value={props}>
			{children}
		</RepeaterContext.Provider>
	);
};

export { RepeaterContext, RepeaterContextProvider };
