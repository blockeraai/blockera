/**
 * External dependencies
 */
import { createContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isFunction, isUndefined } from '@publisher/utils';

const RepeaterContext = createContext({
	design: 'minimal',
	mode: 'popover',
	popoverTitle: '',
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
	getControlId: null,
	//
	attributes: {},
	defaultValue: {},
	repeaterItems: {}, // value
	//
	customProps: {}, // we use this for passing props from out of RepeaterControl to RepeaterItemHeader and RepeaterItemChildren
});

const RepeaterContextProvider = ({ children, ...props }) => {
	if (!isFunction(props.getControlId))
		props.getControlId = (itemId, id) => {
			if (!/\[.*]/g.test(id)) {
				id = `.${id}`;
			}

			return isUndefined(props.repeaterId)
				? `[${itemId}]${id}`
				: `${props.repeaterId}[${itemId}]${id}`;
		};

	return (
		<RepeaterContext.Provider value={props}>
			{children}
		</RepeaterContext.Provider>
	);
};

export { RepeaterContext, RepeaterContextProvider };
