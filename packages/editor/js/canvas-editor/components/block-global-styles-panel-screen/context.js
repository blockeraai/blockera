// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { createContext, useContext } from '@wordpress/element';

export const GlobalStylesPanelContext = createContext({
	currentBlockStyleVariation: {
		name: '',
		label: '',
	},
	setCurrentBlockStyleVariation: () => {},
});

export const GlobalStylesPanelContextProvider = ({
	children,
	...props
}: Object): MixedElement => {
	return (
		<GlobalStylesPanelContext.Provider value={props}>
			{children}
		</GlobalStylesPanelContext.Provider>
	);
};

export const useGlobalStylesPanelContext = () => {
	return useContext(GlobalStylesPanelContext);
};
