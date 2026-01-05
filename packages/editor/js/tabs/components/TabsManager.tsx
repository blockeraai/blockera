/**
 * WordPress dependencies
 */
import {
	useEffect,
	useState,
	useCallback,
	createPortal,
	useRef,
	useMemo,
	startTransition,
} from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import fastDeepEqual from 'fast-deep-equal/es6';
import { store as coreStore } from '@wordpress/core-data';
import { store as editorStore } from '@wordpress/editor';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import TabsBar from './TabsBar';
import CloseTabConfirmDialog from './CloseTabConfirmDialog';
import RenameTabModal from './RenameTabModal';
import TabLockedModal from './TabLockedModal';
import TabKeyboardShortcuts from './TabKeyboardShortcuts';
import { useCurrentEntity, usePrefetchEntity } from '../../hooks';
import { useTabs } from '../hooks/useTabs';
import { useTabsPersistence } from '../hooks/useTabsPersistence';
import { useRecentlyClosedTabs } from '../hooks/useRecentlyClosedTabs';
import { useSwitchDocument } from '../hooks/useSwitchDocument';
import { CommandBarIntegration } from '../../command-bar';
import { usePrefetchTabEntities } from '../hooks/usePrefetchTabEntities';
import { useBulkEditTabs } from '../hooks/useBulkEditTabs';
import { useTabsLockState, LockInfo } from '../hooks/useTabsLockState';
import { useTabsLockPolling } from '../hooks/useTabsLockPolling';
import {
	closeTab,
	closeOthers,
	closeToRight,
	closeSaved,
	sortTabsByPinned,
} from '../utils/tabActions';
import { hasLocalAutosave } from '../utils/hasLocalAutosave';
import type { Tab, RecentlyClosedTab } from '../types';

/**
 * Close action type.
 */
type CloseAction = 'single' | 'others' | 'toRight' | null;

/**
 * Main Tabs Manager component
 *
 * Manages the tabs bar, tab switching, and tab-related operations.
 * Uses unified entity hooks for consistent data access across all tabs.
 */
export default function TabsManager(): React.ReactElement | null {
	/*
	 * Get current document info from unified hook.
	 * useCurrentEntity automatically detects the active document from editor store.
	 */
	const currentEntity = useCurrentEntity();
	const { id: postId, type: postType } = currentEntity;

	/*
	 * Get prefetchEntity function for preloading entity data before tab switch.
	 * This ensures instant tab switching by loading data into the store first.
	 */
	const prefetchEntity = usePrefetchEntity();

	// Persistence settings for tabs and recently closed tabs
	const {
		isPersistenceEnabled,
		togglePersistence,
		isRecentlyClosedPersistenceEnabled,
		toggleRecentlyClosedPersistence,
		isTabIconsEnabled,
		toggleTabIcons,
		isIconOnlyPinnedTabsEnabled,
		toggleIconOnlyPinnedTabs,
	} = useTabsPersistence();

	// Recently closed tabs (persisted to localStorage if enabled)
	const {
		recentlyClosedTabs,
		addClosedTab,
		reopenTab,
		removeClosedTab,
		updateClosedTab,
	} = useRecentlyClosedTabs({
		persistenceEnabled: isRecentlyClosedPersistenceEnabled,
	});

	const {
		tabs,
		pinnedTabs,
		unpinnedTabs,
		addTab,
		removeTab,
		togglePinTab,
		setTabs,
		setTabCustomTitle,
		updateTabTitle,
		reorderTabs,
	} = useTabs({
		persistenceEnabled: isPersistenceEnabled,
	});

	const switchDocument = useSwitchDocument();
	const [showRenameModal, setShowRenameModal] = useState(false);
	const [renameTabKey, setRenameTabKey] = useState<string | null>(null);
	const [activeTabKey, setActiveTabKey] = useState<string | null>(null);
	const [previousTabKey, setPreviousTabKey] = useState<string | null>(null);
	const [pendingCloseTabs, setPendingCloseTabs] = useState<Tab[]>([]);
	const [isSavingTab, setIsSavingTab] = useState(false);
	const [closeAction, setCloseAction] = useState<CloseAction>(null);
	const [closeActionTargetKey, setCloseActionTargetKey] = useState<
		string | null
	>(null);

	/*
	 * Post Lock State
	 *
	 * These states manage the lock modal UI:
	 * - showLockedModal: Controls visibility of TabLockedModal
	 * - lockedTabKey: Which tab triggered the modal (needed for actions)
	 */
	const [showLockedModal, setShowLockedModal] = useState(false);
	const [lockedTabKey, setLockedTabKey] = useState<string | null>(null);

	/*
	 * Autosave Backup Detection State
	 *
	 * Tracks which tabs have local autosave backups in sessionStorage.
	 * This detection runs automatically and can be used in the future
	 * to show indicators or enable features based on autosave presence.
	 *
	 * The state is kept in sync via useEffect that watches:
	 * - Tab changes
	 * - Post ID changes (tab switches)
	 * - Autosave restore notice changes (user restored/dismissed backup)
	 */
	const [tabsWithAutosave, setTabsWithAutosave] = useState<Set<string>>(
		new Set()
	);

	/*
	 * Lock State Hook
	 *
	 * Provides functions to check/update lock states for all tabs.
	 * States are stored in memory only (not persisted across page loads).
	 */
	const {
		isTabLocked,
		getLockUser,
		setLockState,
		updateBulkLockStates,
		clearLockState,
	} = useTabsLockState();

	// Get function to check if entity is dirty
	const hasEditsForEntityRecord = useSelect(
		(select) =>
			(
				select(coreStore) as {
					hasEditsForEntityRecord: (
						kind: string,
						name: string,
						id: string | number
					) => boolean;
				}
			).hasEditsForEntityRecord,
		[]
	);

	// Get save functions and actions
	const { saveEntityRecord, editEntityRecord } = useDispatch(coreStore) as {
		saveEntityRecord: (
			kind: string,
			name: string,
			id: string | number
		) => Promise<void>;
		editEntityRecord: (
			kind: string,
			name: string,
			id: string | number,
			edits: Record<string, unknown>,
			options?: { undoIgnore?: boolean }
		) => void;
	};
	const { savePost, updatePostLock } = useDispatch(editorStore) as {
		savePost: () => Promise<void>;
		updatePostLock: (lock: { isLocked: boolean }) => void;
	};
	const { removeNotice } = useDispatch(noticesStore);
	const getEditedEntityRecord = useSelect(
		(select) =>
			(
				select(coreStore) as {
					getEditedEntityRecord: (
						kind: string,
						name: string,
						id: string | number
					) => Record<string, unknown> | undefined;
				}
			).getEditedEntityRecord,
		[]
	);
	const getRawEntityRecord = useSelect(
		(select) =>
			(
				select(coreStore) as {
					getRawEntityRecord: (
						kind: string,
						name: string,
						id: string | number
					) => Record<string, unknown> | undefined;
				}
			).getRawEntityRecord,
		[]
	);
	const currentPostId = useSelect(
		(select) =>
			(
				select(editorStore) as {
					getCurrentPostId: () => number | undefined;
				}
			).getCurrentPostId(),
		[]
	);
	const currentPostType = useSelect(
		(select) =>
			(
				select(editorStore) as {
					getCurrentPostType: () => string | undefined;
				}
			).getCurrentPostType(),
		[]
	);

	/*
	 * Block Editor Lock State Selector
	 *
	 * We watch the block editor's internal lock state to suppress its modal.
	 */
	const isEditorPostLocked = useSelect(
		(select) =>
			(
				select(editorStore) as { isPostLocked: () => boolean }
			).isPostLocked(),
		[]
	);

	/*
	 * Autosave Notice Selector
	 *
	 * Watches for the presence of the wpEditorAutosaveRestore notice.
	 * When this notice is dismissed (user clicks Restore or dismisses),
	 * we need to re-check autosave status for all tabs.
	 */
	const hasAutosaveRestoreNotice = useSelect((select) => {
		const notices = (
			select(noticesStore) as {
				getNotices: () => Array<{ id: string }>;
			}
		).getNotices();
		return notices.some(
			(notice) => notice.id === 'wpEditorAutosaveRestore'
		);
	}, []);

	// Helper function to check if a tab is dirty
	const getIsDirty = useCallback(
		(tabPostType: string, tabPostId: string | number): boolean => {
			try {
				return hasEditsForEntityRecord(
					'postType',
					tabPostType,
					tabPostId
				);
			} catch {
				return false;
			}
		},
		[hasEditsForEntityRecord]
	);

	/*
	 * Get current document title from useCurrentEntity hook.
	 *
	 * Since useEntity now has equality checking and returns stable references,
	 * we can use currentEntity.title directly instead of creating a separate
	 * selector. This eliminates redundant store subscriptions and prevents
	 * unnecessary re-renders.
	 */
	const currentDocumentTitle = currentEntity.title;

	/*
	 * Helper function to get tab title for display.
	 *
	 * For the active tab (current document), we use the title from our
	 * useSelect subscription for real-time updates. For other tabs, we use
	 * the cached tab.title property which is kept up-to-date by the Tab component.
	 */
	const getTabTitle = useCallback(
		(tab: Tab | RecentlyClosedTab): string => {
			// For active tab, use real-time title from store
			if (tab.key === activeTabKey && currentDocumentTitle) {
				return currentDocumentTitle;
			}

			// Use cached title from tab object
			if (tab.title) {
				return tab.title;
			}

			return sprintf(
				/* translators: %1$s: post type, %2$s: post ID */
				__('%1$s #%2$s', 'blockera'),
				tab.type,
				String(tab.id)
			);
		},
		[activeTabKey, currentDocumentTitle]
	);

	/*
	 * Callback: Active Tab Locked by Another User
	 */
	const handleActiveTabLocked = useCallback(
		(tabKey: string, lockInfo: LockInfo): void => {
			setLockState(tabKey, lockInfo);

			// Only show our custom modal when multiple tabs are open
			if (tabs.length > 1) {
				updatePostLock({ isLocked: false });
				setLockedTabKey(tabKey);
				setShowLockedModal(true);
			}
		},
		[tabs.length, setLockState, updatePostLock]
	);

	// Background polling for post lock states
	const { takeoverLock, checkSingleLock } = useTabsLockPolling({
		tabs,
		activeTabKey,
		updateBulkLockStates,
		onActiveTabLocked: handleActiveTabLocked,
	});

	/*
	 * Effect: Suppress Block Editor's PostLockedModal
	 */
	useEffect(() => {
		if (tabs.length > 1 && isEditorPostLocked) {
			updatePostLock({ isLocked: false });
		}
	}, [tabs.length, isEditorPostLocked, updatePostLock]);

	// Handle bulk edit posts from URL parameters
	useBulkEditTabs(addTab, prefetchEntity, postType);

	// Pre-fetch entity data for all tabs on initial page load
	usePrefetchTabEntities(tabs, postType, postId);

	/*
	 * Clear local autosave recovery notice when switching tabs.
	 *
	 * The Block Editor's LocalAutosaveMonitor creates a notice with ID 'wpEditorAutosaveRestore'
	 * when a post has a local autosave backup. However, it doesn't remove the notice when
	 * switching to a different post without a backup (it early-returns instead).
	 *
	 * This causes confusing UX in multi-tab editing: the notice from Post A remains visible
	 * when switching to Post B which has no backup.
	 *
	 * We use the cleanup function pattern here: when postId changes, the cleanup runs FIRST
	 * (removing the old notice), then the Block Editor's effect runs and may create a new
	 * notice if the new post has a backup. This ensures proper sequencing.
	 */
	useEffect(() => {
		// Return cleanup function that removes the notice when switching away from this post
		return () => {
			removeNotice('wpEditorAutosaveRestore');
		};
	}, [postId, removeNotice]);

	/*
	 * Check for local autosave backups on all tabs.
	 *
	 * sessionStorage doesn't fire events when values change, so we:
	 * 1. Check immediately when tabs change
	 * 2. Re-check periodically (every 15 seconds) to catch new autosaves
	 * 3. Re-check when postId changes (tab switch) for immediate feedback
	 * 4. Re-check when hasAutosaveRestoreNotice changes (user restored/dismissed backup)
	 */
	useEffect(() => {
		const checkAutosaves = (): void => {
			const autosaveTabs = new Set<string>();

			tabs.forEach((tab) => {
				// Check if this tab's post has a local autosave backup
				// isPostNew is false for regular posts in tabs
				if (hasLocalAutosave(tab.id, false)) {
					autosaveTabs.add(tab.key);
				}
			});

			setTabsWithAutosave(autosaveTabs);
		};

		// Check immediately
		checkAutosaves();

		// Re-check periodically since sessionStorage doesn't fire events
		const intervalId = setInterval(checkAutosaves, 15000);

		return () => {
			clearInterval(intervalId);
		};
	}, [tabs, postId, hasAutosaveRestoreNotice]);

	// Track if we're in the middle of a manual tab switch to prevent duplicate state updates
	const isManualTabSwitchRef = useRef(false);
	// Store the previous tab key during manual switches so we can update it in the useEffect
	const pendingPreviousTabKeyRef = useRef<string | null>(null);

	// Update active tab and add current document to tabs when document changes
	useEffect(() => {
		if (postId && postType) {
			const key = `${postType}-${postId}`;

			// If we're in the middle of a manual tab switch, batch both setPreviousTabKey and setActiveTabKey
			// together to minimize renders. React 18 automatically batches state updates in effects, so we don't
			// need startTransition here - it would actually defer the updates and cause more renders.
			if (isManualTabSwitchRef.current) {
				// React 18 automatically batches these state updates in effects, so they'll happen in one render
				// Update previousTabKey if we have a pending value
				if (pendingPreviousTabKeyRef.current !== null) {
					setPreviousTabKey(pendingPreviousTabKeyRef.current);
					pendingPreviousTabKeyRef.current = null;
				}
				// Update activeTabKey if needed
				if (activeTabKey !== key) {
					setActiveTabKey(key);
				}
				// Still add to tabs and handle other side effects
				void addTab(postType, postId);
				removeClosedTab(key);
				void checkSingleLock(postId).then((lockInfo) => {
					if (lockInfo?.isLocked) {
						setLockState(key, lockInfo);
						if (tabs.length > 1) {
							updatePostLock({ isLocked: false });
							setLockedTabKey(key);
							setShowLockedModal(true);
						}
					} else {
						void takeoverLock(postId);
					}
				});
				// Reset the flag after a brief delay to allow the switch to complete
				setTimeout(() => {
					isManualTabSwitchRef.current = false;
				}, 0);
				return;
			}

			// Track previous tab before switching (only if not manual switch)
			if (activeTabKey && activeTabKey !== key) {
				setPreviousTabKey(activeTabKey);
			}
			setActiveTabKey(key);

			// Add to tabs if not already present
			void addTab(postType, postId);

			// Remove from recently closed if it was there
			removeClosedTab(key);

			// Check lock state for the newly added/switched tab
			void checkSingleLock(postId).then((lockInfo) => {
				if (lockInfo?.isLocked) {
					setLockState(key, lockInfo);

					if (tabs.length > 1) {
						updatePostLock({ isLocked: false });
						setLockedTabKey(key);
						setShowLockedModal(true);
					}
				} else {
					void takeoverLock(postId);
				}
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postId, postType]);

	/*
	 * Stabilize dependencies using refs to prevent unnecessary callback recreation.
	 * Many dependencies (tabs, switchDocument, isTabLocked, updatePostLock) may have
	 * stable references, but to be safe we use refs to ensure callbacks don't recreate
	 * unnecessarily.
	 */
	const tabsRef = useRef(tabs);
	const tabsKeysRef = useRef<string>(tabs.map((t) => t.key).join(','));
	const switchDocumentRef = useRef(switchDocument);
	const isTabLockedRef = useRef(isTabLocked);
	const updatePostLockRef = useRef(updatePostLock);
	const activeTabKeyRef = useRef(activeTabKey);

	// Update refs when values actually change
	useEffect(() => {
		const currentKeys = tabs.map((t) => t.key).join(',');
		if (currentKeys !== tabsKeysRef.current) {
			tabsRef.current = tabs;
			tabsKeysRef.current = currentKeys;
		}
		switchDocumentRef.current = switchDocument;
		isTabLockedRef.current = isTabLocked;
		updatePostLockRef.current = updatePostLock;
		activeTabKeyRef.current = activeTabKey;
	}, [tabs, switchDocument, isTabLocked, updatePostLock, activeTabKey]);

	const handleTabClick = useCallback(
		(key: string): void => {
			// Use refs to get latest values without depending on them in deps
			const currentTabs = tabsRef.current;
			const currentActiveTabKey = activeTabKeyRef.current;
			const tab = currentTabs.find((t) => t.key === key);
			if (tab && tab.key !== currentActiveTabKey) {
				// Mark that we're doing a manual tab switch to prevent the useEffect from
				// duplicating state updates when postId/postType change
				isManualTabSwitchRef.current = true;

				// Store the previous tab key in a ref so the useEffect can batch it with setActiveTabKey
				pendingPreviousTabKeyRef.current = currentActiveTabKey;

				// Call switchDocument - this will update the editor store asynchronously
				// The useEffect will handle both setPreviousTabKey and setActiveTabKey together when postId/postType change
				void switchDocumentRef.current(tab.type, tab.id).then(() => {
					// Reset the flag after switchDocument completes
					// The useEffect has already handled both setPreviousTabKey and setActiveTabKey, so we can reset now
					isManualTabSwitchRef.current = false;
				});

				if (isTabLockedRef.current(key) && currentTabs.length > 1) {
					updatePostLockRef.current({ isLocked: false });
					setLockedTabKey(key);
					setShowLockedModal(true);
				}
			}
		},
		[] // Empty deps - all values accessed via refs
	);

	// Helper function to clear entity edits from the store
	const clearEntityEdits = useCallback(
		(tabPostType: string, tabPostId: string | number): void => {
			try {
				const editedRecord = getEditedEntityRecord(
					'postType',
					tabPostType,
					tabPostId
				);
				const rawRecord = getRawEntityRecord(
					'postType',
					tabPostType,
					tabPostId
				);

				if (!editedRecord || !rawRecord) {
					return;
				}

				const editsToClear: Record<string, undefined> = {};
				Object.keys(editedRecord).forEach((key) => {
					if (!fastDeepEqual(editedRecord[key], rawRecord[key])) {
						editsToClear[key] = undefined;
					}
				});

				if (Object.keys(editsToClear).length > 0) {
					editEntityRecord(
						'postType',
						tabPostType,
						tabPostId,
						editsToClear,
						{
							undoIgnore: true,
						}
					);
				}
			} catch {
				// Entity might not be loaded
			}
		},
		[getEditedEntityRecord, getRawEntityRecord, editEntityRecord]
	);

	// Internal function to actually close the tab
	const performTabClose = useCallback(
		(key: string): void => {
			if (tabs.length <= 1) {
				return;
			}

			const tab = tabs.find((t) => t.key === key);
			if (tab && tab.isPinned) {
				return;
			}

			if (tab) {
				// tab.title already has the correct cached title
				addClosedTab(tab);
				clearEntityEdits(tab.type, tab.id);
				clearLockState(key);
				closeTab(tabs, key);
				removeTab(key);

				if (key === activeTabKey) {
					// Get sorted tabs to determine left/right position
					// Match the display order: pinned tabs first, then unpinned tabs
					const sortedTabs = [...pinnedTabs, ...unpinnedTabs];
					const closedTabIndex = sortedTabs.findIndex(
						(t) => t.key === key
					);
					const remainingTabs = sortedTabs.filter(
						(t) => t.key !== key
					);

					if (remainingTabs.length > 0) {
						let nextTab: Tab | undefined;

						// If there's a tab to the left, activate that one
						if (closedTabIndex > 0) {
							nextTab = remainingTabs[closedTabIndex - 1];
						} else {
							// Otherwise, activate the next tab to the right (which is now at index 0)
							nextTab = remainingTabs[0];
						}

						if (nextTab) {
							void switchDocument(nextTab.type, nextTab.id);
							setActiveTabKey(nextTab.key);
							setPreviousTabKey(null);
						}
					}
				}
			}
		},
		[
			tabs,
			pinnedTabs,
			unpinnedTabs,
			activeTabKey,
			removeTab,
			switchDocument,
			clearEntityEdits,
			clearLockState,
			addClosedTab,
		]
	);

	// Helper function to find tabs that would be closed by an action
	const findTabsToClose = useCallback(
		(action: CloseAction, targetKey: string | null): Tab[] => {
			if (action === 'single') {
				const tab = tabs.find((t) => t.key === targetKey);
				return tab && !tab.isPinned ? [tab] : [];
			}

			if (action === 'others') {
				return tabs.filter((tab) => {
					return (
						tab.key !== targetKey &&
						!tab.isPinned &&
						getIsDirty(tab.type, tab.id)
					);
				});
			}

			if (action === 'toRight') {
				const sortedTabs = sortTabsByPinned(tabs);
				const targetIndex = sortedTabs.findIndex(
					(t) => t.key === targetKey
				);

				if (
					targetIndex === -1 ||
					targetIndex === sortedTabs.length - 1
				) {
					return [];
				}

				const tabsToRight = sortedTabs.slice(targetIndex + 1);
				return tabsToRight.filter(
					(tab) => !tab.isPinned && getIsDirty(tab.type, tab.id)
				);
			}

			return [];
		},
		[tabs, getIsDirty]
	);

	const handleTabClose = useCallback(
		(key: string): void => {
			if (tabs.length <= 1) {
				return;
			}

			const tab = tabs.find((t) => t.key === key);
			if (tab && tab.isPinned) {
				return;
			}

			if (!tab) {
				return;
			}

			const isDirty = getIsDirty(tab.type, tab.id);

			if (isDirty) {
				setPendingCloseTabs([tab]);
				setCloseAction('single');
				setCloseActionTargetKey(key);
			} else {
				performTabClose(key);
			}
		},
		[tabs, getIsDirty, performTabClose]
	);

	// Internal function to actually perform close others
	const performCloseOthers = useCallback(
		(targetKey: string): void => {
			const tabsToClose = tabs.filter(
				(tab) => tab.key !== targetKey && !tab.isPinned
			);

			tabsToClose.forEach((tab) => {
				// tab.title already has the correct cached title
				addClosedTab(tab);
				clearEntityEdits(tab.type, tab.id);
				clearLockState(tab.key);
			});

			const updatedTabs = closeOthers(tabs, targetKey);
			setTabs(updatedTabs);

			const wasActiveClosed = !updatedTabs.find(
				(t) => t.key === activeTabKey
			);
			if (wasActiveClosed) {
				const targetTab = updatedTabs.find((t) => t.key === targetKey);
				if (targetTab) {
					void switchDocument(targetTab.type, targetTab.id);
					setActiveTabKey(targetKey);
				}
			}
		},
		[
			tabs,
			activeTabKey,
			setTabs,
			switchDocument,
			clearEntityEdits,
			clearLockState,
			addClosedTab,
		]
	);

	// Handler for close others action
	const handleCloseOthers = useCallback(
		(targetKey: string): void => {
			const dirtyTabs = findTabsToClose('others', targetKey);

			if (dirtyTabs.length > 0) {
				setPendingCloseTabs(dirtyTabs);
				setCloseAction('others');
				setCloseActionTargetKey(targetKey);
			} else {
				performCloseOthers(targetKey);
			}
		},
		[findTabsToClose, performCloseOthers]
	);

	// Internal function to actually perform close to right
	const performCloseToRight = useCallback(
		(targetKey: string): void => {
			const sortedTabs = sortTabsByPinned(tabs);

			const targetIndex = sortedTabs.findIndex(
				(t) => t.key === targetKey
			);
			if (targetIndex !== -1 && targetIndex < sortedTabs.length - 1) {
				const tabsToRight = sortedTabs.slice(targetIndex + 1);
				const tabsToClose = tabsToRight.filter((tab) => !tab.isPinned);

				tabsToClose.forEach((tab) => {
					// tab.title already has the correct cached title
					addClosedTab(tab);
					clearEntityEdits(tab.type, tab.id);
					clearLockState(tab.key);
				});
			}

			const updatedTabs = closeToRight(tabs, targetKey);
			setTabs(updatedTabs);

			const wasActiveClosed = !updatedTabs.find(
				(t) => t.key === activeTabKey
			);
			if (wasActiveClosed) {
				const targetTab = updatedTabs.find((t) => t.key === targetKey);
				if (targetTab) {
					void switchDocument(targetTab.type, targetTab.id);
					setActiveTabKey(targetKey);
				}
			}
		},
		[
			tabs,
			activeTabKey,
			setTabs,
			switchDocument,
			clearEntityEdits,
			clearLockState,
			addClosedTab,
		]
	);

	// Handler for close to right action
	const handleCloseToRight = useCallback(
		(targetKey: string): void => {
			const dirtyTabs = findTabsToClose('toRight', targetKey);

			if (dirtyTabs.length > 0) {
				setPendingCloseTabs(dirtyTabs);
				setCloseAction('toRight');
				setCloseActionTargetKey(targetKey);
			} else {
				performCloseToRight(targetKey);
			}
		},
		[findTabsToClose, performCloseToRight]
	);

	// Handler for close saved action
	const handleCloseSaved = useCallback((): void => {
		const tabsToClose = tabs.filter(
			(tab) => !tab.isPinned && !getIsDirty(tab.type, tab.id)
		);

		tabsToClose.forEach((tab) => {
			// tab.title already has the correct cached title
			addClosedTab(tab);
			clearLockState(tab.key);
		});

		const updatedTabs = closeSaved(tabs, getIsDirty);
		setTabs(updatedTabs);

		const wasActiveClosed = !updatedTabs.find(
			(t) => t.key === activeTabKey
		);
		if (wasActiveClosed && updatedTabs.length > 0) {
			const nextTab = updatedTabs[0];
			void switchDocument(nextTab.type, nextTab.id);
			setActiveTabKey(nextTab.key);
		}
	}, [
		tabs,
		activeTabKey,
		setTabs,
		switchDocument,
		getIsDirty,
		clearLockState,
		addClosedTab,
	]);

	// Handler for view action (no-op, handled in Tab component)
	const handleView = useCallback((): void => {
		// View action is handled directly in Tab component
	}, []);

	// Handler for copy view link (no-op, handled in TabContextMenu)
	const handleCopyViewLink = useCallback((): void => {
		// Copy action is handled directly in TabContextMenu
	}, []);

	// Handler for copy editor link (no-op, handled in TabContextMenu)
	const handleCopyEditorLink = useCallback((): void => {
		// Copy action is handled directly in TabContextMenu
	}, []);

	// Handler for toggle pin
	const handleTogglePin = useCallback(
		(key: string): void => {
			togglePinTab(key);
		},
		[togglePinTab]
	);

	// Handler for rename action
	const handleRename = useCallback((key: string): void => {
		setRenameTabKey(key);
		setShowRenameModal(true);
	}, []);

	// Handler for save rename
	const handleSaveRename = useCallback(
		(customTitle: string): void => {
			if (renameTabKey) {
				setTabCustomTitle(renameTabKey, customTitle);
			}
		},
		[renameTabKey, setTabCustomTitle]
	);

	// Handler for clear rename
	const handleClearRename = useCallback(
		(key: string): void => {
			setTabCustomTitle(key, '');
		},
		[setTabCustomTitle]
	);

	// Handler for reordering tabs via drag-and-drop
	// Simplified: receives already-reordered arrays from TabsBar
	const handleReorderTabs = useCallback(
		(newPinnedTabs: Tab[], newUnpinnedTabs: Tab[]): void => {
			reorderTabs(newPinnedTabs, newUnpinnedTabs);
		},
		[reorderTabs]
	);

	// Handler for reopening a recently closed tab
	const handleReopenTab = useCallback(
		async (tabKey: string): Promise<void> => {
			const tab = reopenTab(tabKey);
			if (tab) {
				try {
					// Prefetch entity data before switching for instant tab switch
					await prefetchEntity(tab.type, tab.id);

					// Add tab (handles duplicate check internally)
					await addTab(
						tab.type,
						tab.id,
						tab.title,
						tab.slug,
						tab.status
					);

					// Switch to the reopened tab
					switchDocument(tab.type, tab.id);
					setActiveTabKey(tab.key);
				} catch (error) {
					throw error;
				}
			}
		},
		[reopenTab, addTab, switchDocument, prefetchEntity]
	);

	// Handler for locked modal - Take Over
	const handleLockTakeOver = useCallback(async (): Promise<void> => {
		if (!lockedTabKey) {
			return;
		}

		const tab = tabs.find((t) => t.key === lockedTabKey);
		if (!tab) {
			setShowLockedModal(false);
			setLockedTabKey(null);
			return;
		}

		const success = await takeoverLock(tab.id);

		if (success) {
			clearLockState(lockedTabKey);
		}

		setShowLockedModal(false);
		setLockedTabKey(null);
	}, [lockedTabKey, tabs, takeoverLock, clearLockState]);

	// Handler for locked modal - Close Tab
	const handleLockCloseTab = useCallback((): void => {
		if (!lockedTabKey) {
			return;
		}

		const tab = tabs.find((t) => t.key === lockedTabKey);
		if (tab) {
			clearLockState(lockedTabKey);
			removeTab(lockedTabKey);

			const remainingTabs = tabs.filter((t) => t.key !== lockedTabKey);
			if (remainingTabs.length > 0) {
				let nextTab: Tab | undefined;
				if (
					previousTabKey &&
					remainingTabs.find((t) => t.key === previousTabKey)
				) {
					nextTab = remainingTabs.find(
						(t) => t.key === previousTabKey
					);
				} else {
					nextTab = remainingTabs[remainingTabs.length - 1];
				}

				if (nextTab) {
					void switchDocument(nextTab.type, nextTab.id);
					setActiveTabKey(nextTab.key);
					setPreviousTabKey(null);
				}
			}
		}

		setShowLockedModal(false);
		setLockedTabKey(null);
	}, [
		lockedTabKey,
		tabs,
		clearLockState,
		removeTab,
		previousTabKey,
		switchDocument,
	]);

	// Handler for Save & Close action
	const handleSaveAndClose = useCallback(async (): Promise<void> => {
		if (pendingCloseTabs.length === 0) {
			return;
		}

		setIsSavingTab(true);
		try {
			const savePromises = pendingCloseTabs.map(async (tab) => {
				const { type, id } = tab;

				if (type === currentPostType && id === currentPostId) {
					await savePost();
				} else {
					await saveEntityRecord('postType', type, id);
				}
			});

			await Promise.all(savePromises);

			if (closeAction === 'single' && closeActionTargetKey) {
				performTabClose(closeActionTargetKey);
			} else if (closeAction === 'others' && closeActionTargetKey) {
				performCloseOthers(closeActionTargetKey);
			} else if (closeAction === 'toRight' && closeActionTargetKey) {
				performCloseToRight(closeActionTargetKey);
			}

			setPendingCloseTabs([]);
			setCloseAction(null);
			setCloseActionTargetKey(null);
		} catch {
			// Error saving - WordPress will show error notification
		} finally {
			setIsSavingTab(false);
		}
	}, [
		pendingCloseTabs,
		closeAction,
		closeActionTargetKey,
		currentPostType,
		currentPostId,
		savePost,
		saveEntityRecord,
		performTabClose,
		performCloseOthers,
		performCloseToRight,
	]);

	// Handler for Close Without Saving action
	const handleCloseWithoutSaving = useCallback((): void => {
		if (pendingCloseTabs.length === 0) {
			return;
		}

		if (closeAction === 'single' && closeActionTargetKey) {
			performTabClose(closeActionTargetKey);
		} else if (closeAction === 'others' && closeActionTargetKey) {
			performCloseOthers(closeActionTargetKey);
		} else if (closeAction === 'toRight' && closeActionTargetKey) {
			performCloseToRight(closeActionTargetKey);
		}

		setPendingCloseTabs([]);
		setCloseAction(null);
		setCloseActionTargetKey(null);
	}, [
		pendingCloseTabs,
		closeAction,
		closeActionTargetKey,
		performTabClose,
		performCloseOthers,
		performCloseToRight,
	]);

	// Handler for Cancel action
	const handleCancelClose = useCallback((): void => {
		setPendingCloseTabs([]);
		setCloseAction(null);
		setCloseActionTargetKey(null);
	}, []);

	// Handler for Review tab action
	const handleReviewTab = useCallback(
		(tab: Tab): void => {
			void switchDocument(tab.type, tab.id);
			setActiveTabKey(tab.key);

			setPendingCloseTabs([]);
			setCloseAction(null);
			setCloseActionTargetKey(null);
		},
		[switchDocument]
	);

	// Find insertion point for tabs bar
	const [container, setContainer] = useState<HTMLElement | null>(null);

	useEffect(() => {
		const findContainer = (): HTMLElement | null => {
			return document.querySelector(
				'.interface-interface-skeleton__content'
			) as HTMLElement | null;
		};

		const setupTabsContainer = (parent: HTMLElement): void => {
			let tabsContainer = parent.querySelector(
				'.blockera-tabs-wrapper'
			) as HTMLElement | null;

			if (!tabsContainer) {
				tabsContainer = document.createElement('div');
				tabsContainer.className = 'blockera-tabs-wrapper';

				if (parent.firstChild) {
					parent.insertBefore(tabsContainer, parent.firstChild);
				} else {
					parent.appendChild(tabsContainer);
				}
			}

			setContainer(tabsContainer);
		};

		// Check if current container is still in DOM (might have been replaced when pattern opened)
		if (container && !document.contains(container)) {
			setContainer(null);
		}

		let skeletonContent = findContainer();

		if (!skeletonContent) {
			const observer = new MutationObserver(() => {
				skeletonContent = findContainer();
				if (skeletonContent) {
					observer.disconnect();
					setupTabsContainer(skeletonContent);
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true,
			});

			const timeout = setTimeout(() => {
				observer.disconnect();
			}, 5000);

			return () => {
				observer.disconnect();
				clearTimeout(timeout);
			};
		}
		setupTabsContainer(skeletonContent);
		// Re-run when postId or postType changes (e.g., when pattern opens)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postId, postType]);

	if (!container || tabs.length === 0) {
		return null;
	}

	return (
		<CommandBarIntegration
			addTab={addTab}
			switchDocument={switchDocument}
			prefetchEntity={prefetchEntity}
			tabs={tabs}
		>
			{({ openAddTabCommandBar }) => (
				<>
					<TabKeyboardShortcuts
						openAddTabCommandBar={openAddTabCommandBar}
						tabs={tabs}
						activeTabKey={activeTabKey}
						onTabClick={handleTabClick}
						onTabClose={handleTabClose}
						onReopenTab={handleReopenTab}
						recentlyClosedTabs={recentlyClosedTabs}
					/>

					{createPortal(
						<>
							<TabsBar
								pinnedTabs={pinnedTabs}
								unpinnedTabs={unpinnedTabs}
								activeTabKey={activeTabKey}
								getIsDirty={getIsDirty}
								isTabLocked={isTabLocked}
								getLockUser={getLockUser}
								onTabClick={handleTabClick}
								onTabClose={handleTabClose}
								onAddClick={openAddTabCommandBar}
								onCloseOthers={handleCloseOthers}
								onCloseToRight={handleCloseToRight}
								onCloseSaved={handleCloseSaved}
								onView={handleView}
								onCopyViewLink={handleCopyViewLink}
								onCopyEditorLink={handleCopyEditorLink}
								onTogglePin={handleTogglePin}
								onRename={handleRename}
								onClearRename={handleClearRename}
								isPersistenceEnabled={isPersistenceEnabled}
								onTogglePersistence={togglePersistence}
								isRecentlyClosedPersistenceEnabled={
									isRecentlyClosedPersistenceEnabled
								}
								onToggleRecentlyClosedPersistence={
									toggleRecentlyClosedPersistence
								}
								isTabIconsEnabled={isTabIconsEnabled}
								onToggleTabIcons={toggleTabIcons}
								isIconOnlyPinnedTabsEnabled={
									isIconOnlyPinnedTabsEnabled
								}
								onToggleIconOnlyPinnedTabs={
									toggleIconOnlyPinnedTabs
								}
								recentlyClosedTabs={recentlyClosedTabs}
								onReopenTab={handleReopenTab}
								onUpdateTabTitle={updateTabTitle}
								onUpdateClosedTab={updateClosedTab}
								onRemoveClosedTab={removeClosedTab}
								onReorderTabs={handleReorderTabs}
							/>

							<CloseTabConfirmDialog
								isOpen={pendingCloseTabs.length > 0}
								onClose={handleCancelClose}
								onSaveAndClose={handleSaveAndClose}
								onCloseWithoutSaving={handleCloseWithoutSaving}
								tabs={pendingCloseTabs}
								getTabTitle={getTabTitle}
								onReviewTab={handleReviewTab}
								activeTabKey={activeTabKey}
								isSaving={isSavingTab}
							/>

							<RenameTabModal
								isOpen={showRenameModal}
								onClose={() => {
									setShowRenameModal(false);
									setRenameTabKey(null);
								}}
								onSave={handleSaveRename}
								tab={
									tabs.find(
										(tab) => tab.key === renameTabKey
									) ?? null
								}
							/>

							<TabLockedModal
								isOpen={showLockedModal}
								lockUser={
									lockedTabKey
										? getLockUser(lockedTabKey)
										: null
								}
								onTakeOver={handleLockTakeOver}
								onCloseTab={handleLockCloseTab}
							/>
						</>,
						container
					)}
				</>
			)}
		</CommandBarIntegration>
	);
}
