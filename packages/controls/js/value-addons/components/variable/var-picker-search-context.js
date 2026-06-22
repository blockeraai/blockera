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
};

export const VarPickerSearchContext: React$Context<VarPickerSearchContextValue> =
	createContext({
		deferSectionSearchEmptyState: false,
		consumeAddSearchSeed: undefined,
	});

export function useVarPickerSearchContext(): VarPickerSearchContextValue {
	return (useContext(VarPickerSearchContext): VarPickerSearchContextValue);
}
