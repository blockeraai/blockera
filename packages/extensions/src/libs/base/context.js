/**
 * WordPress dependencies
 */
import { createContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import * as config from './config';

const BaseExtensionContext = createContext({
	config,
});

const BaseExtensionContextProvider = ({ children, ...props }) => {
	return (
		<BaseExtensionContext.Provider value={props}>
			{children}
		</BaseExtensionContext.Provider>
	);
};

export { BaseExtensionContext, BaseExtensionContextProvider };
