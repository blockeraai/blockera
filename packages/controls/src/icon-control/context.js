/**
 * WordPress dependencies
 */
import { createContext } from '@wordpress/element';

const IconContext = createContext({
	iconInfo: {
		name: null,
		size: null,
		type: null,
		uploadSVG: null,
	},
	dispatch: () => {},
	recommendationList: [],
	handleOnIconClick: () => {},
});

const IconContextProvider = ({ children, ...props }) => {
	return (
		<IconContext.Provider value={props}>{children}</IconContext.Provider>
	);
};

export { IconContext, IconContextProvider };
