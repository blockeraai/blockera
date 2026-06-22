// @flow
/**
 * External dependencies
 */
import { useCallback, useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { VarPickerCustomAddAction } from './var-picker-custom-add-context';

type UseVarPickerAddWithSearchClearOptions = {
	captureSearchSeed?: () => void,
};

/**
 * Defers custom-add until after search is cleared so new repeater rows render and scroll into view.
 */
export function useVarPickerAddWithSearchClear(
	isSearchActive: boolean,
	clearSearch: () => void,
	customAddAction: VarPickerCustomAddAction,
	options: UseVarPickerAddWithSearchClearOptions = {}
): () => void {
	const { captureSearchSeed } = options;
	const pendingAddRef = useRef(false);

	const triggerAddNew = useCallback(() => {
		if (isSearchActive) {
			captureSearchSeed?.();
			pendingAddRef.current = true;
			clearSearch();
			return;
		}

		if (customAddAction?.canAdd === true) {
			customAddAction.onClick();
		}
	}, [isSearchActive, clearSearch, customAddAction, captureSearchSeed]);

	useEffect(() => {
		if (isSearchActive || !pendingAddRef.current) {
			return;
		}

		if (!customAddAction || customAddAction.canAdd !== true) {
			return;
		}

		pendingAddRef.current = false;

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				customAddAction.onClick();
			});
		});
	}, [isSearchActive, customAddAction]);

	return triggerAddNew;
}
