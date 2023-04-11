/**
 * WordPress dependencies
 */
import { createContext } from '@wordpress/element';

const IconContext = createContext( {
	size: null,
	setSize: () => {},
	recommendationList: [],
	handleOnIconClick: () => {},
} );

const IconContextProvider = ( { children, ...props } ) => {
	return (
		<IconContext.Provider value={ props }>
			{ children }
		</IconContext.Provider>
	);
};

export { IconContext, IconContextProvider };
