/**
 * Utils index - exports all tab-related utility functions
 */

export {
	TABS_STORAGE_KEY,
	PERSISTENCE_STORAGE_KEY,
	RECENTLY_CLOSED_STORAGE_KEY,
	RECENTLY_CLOSED_PERSISTENCE_KEY,
} from './storageKeys';
export type { StorageKey } from './storageKeys';

export {
	getCurrentEditorContext,
	getEditorContextForPostType,
	isCrossBoundaryNavigation,
} from './editorContext';
export type { EditorContext } from './editorContext';

export { openOrFocusTab } from './openOrFocusTab';
export type { OpenOrFocusTabParams } from './openOrFocusTab';

export { ensurePostEntityAccessible } from './ensurePostEntityAccessible';

export { buildTabSwitchCandidates } from './buildTabSwitchCandidates';

export {
	sortTabsByPinned,
	closeTab,
	closeOthers,
	closeToRight,
	closeSaved,
} from './tabActions';
export type { GetIsDirtyFn } from './tabActions';

export { extractImageUrlsFromBlocks } from './extractImageUrlsFromBlocks';

export { prefetchImages } from './prefetchImages';

export { resolveTabsConfig, hasReachedLimit } from './tabsConfig';
export type { TabsConfig, TabsLimitsConfig } from './tabsConfig';
