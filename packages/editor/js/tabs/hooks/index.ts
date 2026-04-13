/**
 * Hooks index - exports all tab-related hooks
 */

export { useTabs, clearTabsFromStorage } from './useTabs';
export { useSwitchDocument } from './useSwitchDocument';
export { useSaveAll } from './useSaveAll';
export type { UseSaveAllReturn } from './useSaveAll';
export {
	useRecentlyClosedTabs,
	clearRecentlyClosedFromStorage,
} from './useRecentlyClosedTabs';
export type {
	UseRecentlyClosedTabsOptions,
	UseRecentlyClosedTabsReturn,
} from './useRecentlyClosedTabs';
export { useTabsPersistence } from './useTabsPersistence';
export type { UseTabsPersistenceReturn } from './useTabsPersistence';
export { useBulkEditTabs } from './useBulkEditTabs';
export { usePrefetchTabEntities } from './usePrefetchTabEntities';
export { useEditorPostTypeTransition } from './useEditorPostTypeTransition';
export { useTabsLockState } from './useTabsLockState';
export type {
	LockInfo,
	LockStatesMap,
	UseTabsLockStateReturn,
} from './useTabsLockState';
export { useTabsLockPolling } from './useTabsLockPolling';
export type {
	UseTabsLockPollingParams,
	UseTabsLockPollingReturn,
} from './useTabsLockPolling';
