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
	customAddAction:
		VarPickerCustomAddAction | { current: VarPickerCustomAddAction },
	options: UseVarPickerAddWithSearchClearOptions = {}
): () => void {
	const { captureSearchSeed } = options;
	const pendingAddRef = useRef(false);

	const resolveCustomAddAction = (): VarPickerCustomAddAction => {
		if (
			customAddAction &&
			typeof customAddAction === 'object' &&
			'current' in customAddAction
		) {
			return customAddAction.current;
		}

		return customAddAction;
	};

	const triggerAddNew = useCallback(() => {
		if (isSearchActive) {
			captureSearchSeed?.();
			pendingAddRef.current = true;
			clearSearch();
			return;
		}

		const resolvedCustomAddAction = resolveCustomAddAction();

		if (resolvedCustomAddAction?.canAdd === true) {
			resolvedCustomAddAction.onClick();
		}
	}, [isSearchActive, clearSearch, customAddAction, captureSearchSeed]);

	useEffect(() => {
		if (isSearchActive || !pendingAddRef.current) {
			return;
		}

		const resolvedCustomAddAction = resolveCustomAddAction();

		if (
			!resolvedCustomAddAction ||
			resolvedCustomAddAction.canAdd !== true
		) {
			return;
		}

		pendingAddRef.current = false;

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				resolvedCustomAddAction.onClick();
			});
		});
	}, [isSearchActive, customAddAction]);

	return triggerAddNew;
}
