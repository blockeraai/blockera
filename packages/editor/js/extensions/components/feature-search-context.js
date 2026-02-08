// @flow

/**
 * External dependencies
 */
import type { Context, MixedElement } from 'react';
import { createContext, useContext } from '@wordpress/element';

/**
 * Feature search context type
 */
export type FeatureSearchContextType = {
	searchQuery: string,
	setSearchQuery: (query: string) => void,
	activeSearchMode: boolean,
};

/**
 * Create search context
 */
export const FeatureSearchContext: Context<FeatureSearchContextType> =
	createContext({
		searchQuery: '',
		setSearchQuery: () => {},
		activeSearchMode: false,
	});

export const FeatureSearchContextProvider = ({
	children,
	value,
}: {
	value: FeatureSearchContextType,
	children: MixedElement,
}): MixedElement => {
	// Check if search query is not empty.
	if (value.searchQuery.trim().length > 0) {
		// Set active search mode to true.
		value.activeSearchMode = true;
	} else {
		// Set active search mode to false.
		value.activeSearchMode = false;
	}

	return (
		<FeatureSearchContext.Provider value={value}>
			{children}
		</FeatureSearchContext.Provider>
	);
};

/**
 * Hook to use feature search context
 */
export const useFeatureSearch = (): FeatureSearchContextType =>
	useContext(FeatureSearchContext);
