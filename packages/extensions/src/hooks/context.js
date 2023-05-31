/**
 * WordPress dependencies
 */
import { createContext } from '@wordpress/element';

const BlockEditContext = createContext({
	handleUpdateCssRules: () => {},
});

const BlockEditContextProvider = ({ children, ...props }) => {
	return (
		<BlockEditContext.Provider value={props}>
			{children}
		</BlockEditContext.Provider>
	);
};

export { BlockEditContext, BlockEditContextProvider };
