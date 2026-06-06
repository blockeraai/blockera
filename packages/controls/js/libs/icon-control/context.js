/**
 * WordPress dependencies
 */
import { createContext } from '@wordpress/element';

const IconContext = createContext({
	currentIcon: {
		icon: null,
		library: null,
		uploadSVG: null,
	},
	dispatch: () => {},
	recommendationList: [],
	handleOnIconClick: () => {},
	suggestionsQuery: '',
	isCurrentIcon: () => {
		return false;
	},
	recentIcons: [],
	removeRecentIcon: () => {},
	clearRecentIcons: () => {},
});

const IconContextProvider = ({ children, ...props }) => {
	return (
		<IconContext.Provider value={props}>{children}</IconContext.Provider>
	);
};

export { IconContext, IconContextProvider };
