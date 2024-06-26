/**
 * WordPress dependencies
 */
import { createContext, useMemo } from '@wordpress/element';

const BlockEditContext = createContext({
	blockProps: {},
});

const BlockEditContextProvider = ({ children, ...props }) => {
	const memoizedValue = useMemo(() => props, [props]);

	return (
		<BlockEditContext.Provider value={memoizedValue}>
			{children}
		</BlockEditContext.Provider>
	);
};

export { BlockEditContext, BlockEditContextProvider };
