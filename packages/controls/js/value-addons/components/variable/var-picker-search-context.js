// @flow
/**
 * External dependencies
 */
import { createContext, useContext } from '@wordpress/element';

export type VarPickerSearchContextValue = {
	/**
	 * When true, preset sections return null instead of per-section search empty
	 * messages; the variable picker shows one unified empty state when needed.
	 */
	deferSectionSearchEmptyState: boolean,
	/**
	 * Consumes a one-shot search term captured when add-new follows a no-match search.
	 */
	consumeAddSearchSeed?: () => ?string,
	/**
	 * Live search query for preset rows and catalog lists. Kept separate from
	 * the preset panel context so typing in search does not re-render preset repeaters.
	 */
	searchQuery?: string,
	normalizedSearchQuery?: string,
};

export const VarPickerSearchContext: React$Context<VarPickerSearchContextValue> =
	createContext({
		deferSectionSearchEmptyState: false,
		consumeAddSearchSeed: undefined,
		searchQuery: '',
		normalizedSearchQuery: '',
	});

export function useVarPickerSearchContext(): VarPickerSearchContextValue {
	return (useContext(VarPickerSearchContext): VarPickerSearchContextValue);
}

export function useVariablePickerSearchQuery(): string {
	const searchCtx = useVarPickerSearchContext();
	if (typeof searchCtx.searchQuery === 'string') {
		return searchCtx.searchQuery;
	}

	return '';
}
