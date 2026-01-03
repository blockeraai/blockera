/**
 * WordPress dependencies
 */
import { useEffect, useCallback, useRef } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
	useShortcut,
	store as keyboardShortcutsStore,
} from '@wordpress/keyboard-shortcuts';

/**
 * Internal dependencies
 */
import { sortTabsByPinned } from '../utils/tabActions';
import type { Tab, RecentlyClosedTab } from '../types';

/**
 * Props for TabKeyboardShortcuts component
 */
export interface TabKeyboardShortcutsProps {
	/** Function to open the command bar (add tab mode) */
	openAddTabCommandBar: () => void;
	/** Array of all tabs */
	tabs: Tab[];
	/** Currently active tab key */
	activeTabKey: string | null;
	/** Function to switch to a tab */
	onTabClick: (key: string) => void;
	/** Function to close a tab */
	onTabClose: (key: string) => void;
	/** Function to reopen a recently closed tab by its key */
	onReopenTab: (tabKey: string) => Promise<void> | void;
	/** Array of recently closed tabs */
	recentlyClosedTabs: RecentlyClosedTab[];
}

/**
 * Component that registers and handles keyboard shortcuts for tabs
 *
 * Shortcuts:
 * - Ctrl+T: Open command bar (add tab mode)
 * - Ctrl+Shift+T: Reopen last closed tab (works multiple times)
 * - Ctrl+1-9: Switch to tab by index
 * - Ctrl+W: Close active tab
 */
export default function TabKeyboardShortcuts({
	openAddTabCommandBar,
	tabs,
	activeTabKey,
	onTabClick,
	onTabClose,
	onReopenTab,
	recentlyClosedTabs,
}: TabKeyboardShortcutsProps): null {
	const { registerShortcut } = useDispatch(keyboardShortcutsStore);

	// Use refs to access latest values without causing re-renders
	const tabsRef = useRef(tabs);
	const activeTabKeyRef = useRef(activeTabKey);
	const recentlyClosedTabsRef = useRef(recentlyClosedTabs);
	const openAddTabCommandBarRef = useRef(openAddTabCommandBar);
	const onTabClickRef = useRef(onTabClick);
	const onTabCloseRef = useRef(onTabClose);
	const onReopenTabRef = useRef(onReopenTab);

	// Update refs when values change
	useEffect(() => {
		tabsRef.current = tabs;
		activeTabKeyRef.current = activeTabKey;
		recentlyClosedTabsRef.current = recentlyClosedTabs;
		openAddTabCommandBarRef.current = openAddTabCommandBar;
		onTabClickRef.current = onTabClick;
		onTabCloseRef.current = onTabClose;
		onReopenTabRef.current = onReopenTab;
	}, [
		tabs,
		activeTabKey,
		recentlyClosedTabs,
		openAddTabCommandBar,
		onTabClick,
		onTabClose,
		onReopenTab,
	]);

	// Register all shortcuts
	useEffect(() => {
		// 1. Add tab: Ctrl+T
		registerShortcut({
			name: 'blockera/tabs/open-add-tab',
			category: 'blockera',
			description: __('Add new tab.', 'blockera-tabs'),
			keyCombination: {
				modifier: 'ctrl',
				character: 't',
			},
		});

		// 2. Close active tab: Ctrl+W
		registerShortcut({
			name: 'blockera/tabs/close-active-tab',
			category: 'blockera',
			description: __('Close the active tab.', 'blockera-tabs'),
			keyCombination: {
				modifier: 'ctrl',
				character: 'w',
			},
		});

		// 3. Reopen last closed tab: Ctrl+Shift+T
		registerShortcut({
			name: 'blockera/tabs/reopen-last-closed',
			category: 'blockera',
			description: __('Reopen the last closed tab.', 'blockera-tabs'),
			keyCombination: {
				modifier: 'ctrlShift',
				character: 't',
			},
		});

		// 4. Switch to tab by number: Ctrl+1-9
		for (let i = 1; i <= 9; i++) {
			registerShortcut({
				name: `blockera/tabs/switch-to-tab-${i}`,
				category: 'blockera',
				description: __(
					`Switch to tab ${i}.`,
					'blockera-tabs'
				),
				keyCombination: {
					modifier: 'ctrl',
					character: String(i),
				},
			});
		}
	}, [registerShortcut]);

	// Handler: Open command bar (Ctrl+T)
	const handleOpenAddTab = useCallback(
		(event: KeyboardEvent) => {
			event.preventDefault();
			openAddTabCommandBarRef.current();
		},
		[]
	);

	// Handler: Reopen last closed tab (Ctrl+Shift+T)
	const handleReopenLastClosed = useCallback(
		async (event: KeyboardEvent) => {
			event.preventDefault();
			const closedTabs = recentlyClosedTabsRef.current;
			if (closedTabs.length > 0) {
				// Get the most recently closed tab (first in array)
				const lastClosedTab = closedTabs[0];
				await onReopenTabRef.current(lastClosedTab.key);
			}
		},
		[]
	);

	// Handler: Switch to tab by number (Ctrl+1-9)
	const createSwitchToTabHandler = useCallback(
		(index: number) => {
			return (event: KeyboardEvent) => {
				event.preventDefault();
				const currentTabs = tabsRef.current;
				const sortedTabs = sortTabsByPinned(currentTabs);
				// Index is 1-based (1-9), convert to 0-based array index
				const tabIndex = index - 1;
				if (tabIndex >= 0 && tabIndex < sortedTabs.length) {
					const targetTab = sortedTabs[tabIndex];
					if (targetTab.key !== activeTabKeyRef.current) {
						onTabClickRef.current(targetTab.key);
					}
				}
			};
		},
		[]
	);

	// Handler: Close active tab (Ctrl+W)
	const handleCloseActiveTab = useCallback(
		(event: KeyboardEvent) => {
			event.preventDefault();
			const currentActiveKey = activeTabKeyRef.current;
			if (currentActiveKey) {
				onTabCloseRef.current(currentActiveKey);
			}
		},
		[]
	);

	// Bind all shortcuts
	useShortcut('blockera/tabs/open-add-tab', handleOpenAddTab);
	useShortcut('blockera/tabs/reopen-last-closed', handleReopenLastClosed);

	// Bind number shortcuts (1-9) - must be called individually (hooks can't be in loops)
	useShortcut('blockera/tabs/switch-to-tab-1', createSwitchToTabHandler(1));
	useShortcut('blockera/tabs/switch-to-tab-2', createSwitchToTabHandler(2));
	useShortcut('blockera/tabs/switch-to-tab-3', createSwitchToTabHandler(3));
	useShortcut('blockera/tabs/switch-to-tab-4', createSwitchToTabHandler(4));
	useShortcut('blockera/tabs/switch-to-tab-5', createSwitchToTabHandler(5));
	useShortcut('blockera/tabs/switch-to-tab-6', createSwitchToTabHandler(6));
	useShortcut('blockera/tabs/switch-to-tab-7', createSwitchToTabHandler(7));
	useShortcut('blockera/tabs/switch-to-tab-8', createSwitchToTabHandler(8));
	useShortcut('blockera/tabs/switch-to-tab-9', createSwitchToTabHandler(9));

	useShortcut('blockera/tabs/close-active-tab', handleCloseActiveTab);

	return null;
}
