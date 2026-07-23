/**
 * External dependencies
 */
import { createContext } from '@wordpress/element';

const PlaygroundContext = createContext({
	blocks: [],
	extension: {},
});

const PlaygroundContextProvider = ({ children, ...props }) => {
	return (
		<PlaygroundContext.Provider value={props}>
			{children}
		</PlaygroundContext.Provider>
	);
};

export { PlaygroundContext, PlaygroundContextProvider };
