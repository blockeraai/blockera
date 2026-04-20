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
