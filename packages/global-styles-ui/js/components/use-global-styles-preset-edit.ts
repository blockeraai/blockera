/**
 * Internal dependencies
 */
import { useGlobalStylesContext } from '../context/global-styles-provider';

/**
 * Mirrors `useUserCan('root', 'globalStyles')` from the editor package for preset editors in Site Editor / navigation.
 * Variable picker rows use `selectable` and are unaffected for choosing a value addon.
 */
export function useCanEditGlobalStyles(): boolean {
	const { canEditGlobalStyles } = useGlobalStylesContext();
	return canEditGlobalStyles === true;
}

/**
 * Variable picker: allow custom preset add while global-styles caps are still loading.
 * Site Editor preset screens keep strict `useCanEditGlobalStyles()`.
 */
export function useCanAddCustomPresetInVariablePicker(): boolean {
	const { canEditGlobalStyles, isReady } = useGlobalStylesContext() as {
		canEditGlobalStyles?: boolean;
		isReady?: boolean;
	};

	if (canEditGlobalStyles === true) {
		return true;
	}

	return isReady !== true;
}

/**
 * Variable picker custom preset fields (name, description, size, etc.) follow the same
 * permissive gate as "Add New" while caps are loading.
 */
export function useCanEditCustomPresetFieldsInVariablePicker(): boolean {
	return useCanAddCustomPresetInVariablePicker();
}
