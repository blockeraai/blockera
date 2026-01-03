/**
 * Shared TypeScript interfaces for the tabs module
 */

/**
 * User who has locked a post.
 */
export interface LockUser {
	/** User ID. */
	id: number;
	/** User display name. */
	name: string;
	/** User avatar URL. */
	avatar: string;
}

/**
 * Tab lock state.
 */
export interface TabLockState {
	/** Whether the tab is locked. */
	isLocked: boolean;
	/** User who has the lock, or null if not locked. */
	lockUser: LockUser | null;
}

/**
 * Tab object representing an open document.
 * Note: isPinned and order are kept for backward compatibility but are not used
 * in the new storage structure (tabs are stored in separate arrays).
 */
export interface Tab {
	/** Post ID. */
	id: number | string;
	/** Post type (e.g., 'post', 'page', 'wp_template'). */
	type: string;
	/** Tab title (post title or generated). */
	title: string;
	/** Post slug, if available. */
	slug: string | null;
	/** Post status, if available. */
	status: string | null;
	/** Unique tab key (e.g., 'post-123'). */
	key: string;
	/** Whether the tab is pinned. (Deprecated: kept for backward compatibility) */
	isPinned: boolean;
	/** Custom title set by user, if any. */
	customTitle?: string | null;
	/** Custom sort order within the pinned or unpinned group. (Deprecated: kept for backward compatibility) */
	order?: number;
}

/**
 * Tabs structure for a workspace.
 * Contains separate arrays for pinned and unpinned tabs.
 */
export interface WorkspaceTabs {
	/** Array of pinned tabs. */
	'pinned-tabs': Tab[];
	/** Array of unpinned tabs. */
	tabs: Tab[];
}

/**
 * Storage structure for tabs.
 * Organized by workspace ID (currently only 'main' is supported).
 */
export interface TabsStorage {
	/** Workspace ID -> WorkspaceTabs mapping. */
	[key: string]: WorkspaceTabs;
}

/**
 * Recently closed tab with timestamp.
 */
export interface RecentlyClosedTab extends Tab {
	/** Timestamp when the tab was closed (ms since epoch). */
	closedAt: number;
}

/**
 * Storage structure for recently closed tabs.
 * Organized by workspace ID (currently only 'main' is supported).
 * Stored as a flat array per workspace (no pinned/unpinned separation).
 */
export interface RecentlyClosedTabsStorage {
	/** Workspace ID -> RecentlyClosedTab[] mapping. */
	[key: string]: RecentlyClosedTab[];
}

/**
 * Options for useTabs hook.
 */
export interface UseTabsOptions {
	/** Whether to save tabs to localStorage (default: true). */
	persistenceEnabled?: boolean;
}

/**
 * Return type for useTabs hook.
 */
export interface UseTabsReturn {
	/** Array of open tabs (combined, for backward compatibility). */
	tabs: Tab[];
	/** Array of pinned tabs. */
	pinnedTabs: Tab[];
	/** Array of unpinned tabs. */
	unpinnedTabs: Tab[];
	/** Add a new tab. */
	addTab: (
		postType: string,
		postId: string | number,
		title?: string | null,
		slug?: string | null,
		status?: string | null
	) => Promise<void>;
	/** Remove a tab by key. */
	removeTab: (key: string) => void;
	/** Update tab title. */
	updateTabTitle: (key: string, title: string) => void;
	/** Refresh all tab titles from entities. */
	refreshTabTitles: () => Promise<void>;
	/** Pin a tab. */
	pinTab: (key: string) => void;
	/** Unpin a tab. */
	unpinTab: (key: string) => void;
	/** Toggle pin state. */
	togglePinTab: (key: string) => void;
	/** Set tabs directly. */
	setTabs: (newTabs: Tab[] | ((prev: Tab[]) => Tab[])) => void;
	/** Set custom title for a tab. */
	setTabCustomTitle: (key: string, customTitle: string | null) => void;
	/** Reorder tabs within a group (pinned or unpinned). */
	reorderTabs: (pinnedTabs: Tab[], unpinnedTabs: Tab[]) => void;
}

/**
 * Context menu action type.
 */
export type ContextMenuAction =
	| 'close'
	| 'closeOthers'
	| 'closeToRight'
	| 'closeSaved'
	| 'pin'
	| 'unpin'
	| 'rename'
	| 'reopenClosed';

/**
 * Context menu props.
 */
export interface ContextMenuProps {
	/** X position. */
	x: number;
	/** Y position. */
	y: number;
	/** Tab key. */
	tabKey: string;
	/** Whether the tab is pinned. */
	isPinned: boolean;
	/** Recently closed tabs for submenu. */
	recentlyClosedTabs: RecentlyClosedTab[];
	/** Callback when menu is closed. */
	onClose: () => void;
	/** Callback when action is selected. */
	onAction: (action: ContextMenuAction, data?: unknown) => void;
}

/**
 * Toolbar context menu props.
 */
export interface ToolbarContextMenuProps {
	/** X position. */
	x: number;
	/** Y position. */
	y: number;
	/** Callback when menu is closed. */
	onClose: () => void;
	/** Close all unpinned tabs. */
	closeAll: () => void;
	/** Close all saved (non-dirty) tabs. */
	closeSaved: () => void;
	/** Save all dirty tabs. */
	saveAll: () => Promise<void>;
	/** Whether currently saving. */
	isSaving: boolean;
	/** Whether persistence is enabled. */
	isPersistenceEnabled: boolean;
	/** Toggle persistence setting. */
	togglePersistence: () => void;
	/** Whether recently closed persistence is enabled. */
	isRecentlyClosedPersistenceEnabled: boolean;
	/** Toggle recently closed persistence. */
	toggleRecentlyClosedPersistence: () => void;
}

/**
 * Rename tab modal props.
 */
export interface RenameTabModalProps {
	/** Whether modal is open. */
	isOpen: boolean;
	/** Tab to rename. */
	tab: Tab | null;
	/** Callback when modal is closed. */
	onClose: () => void;
	/** Callback when title is saved. */
	onSave: (key: string, customTitle: string | null) => void;
}

/**
 * Tab locked modal props.
 */
export interface TabLockedModalProps {
	/** Whether modal is open. */
	isOpen: boolean;
	/** Tab that is locked. */
	tab: Tab | null;
	/** User who has the lock. */
	lockUser: LockUser | null;
	/** Callback when modal is closed. */
	onClose: () => void;
	/** Callback to take over the lock. */
	onTakeover: () => Promise<void>;
}

/**
 * Close tab confirm dialog props.
 */
export interface CloseTabConfirmDialogProps {
	/** Whether dialog is open. */
	isOpen: boolean;
	/** Tab to close. */
	tab: Tab | null;
	/** Callback when dialog is closed. */
	onClose: () => void;
	/** Callback when close is confirmed. */
	onConfirm: () => void;
}

/**
 * Tab component props.
 */
export interface TabProps {
	/** Tab data. */
	tab: Tab;
	/** Whether this tab is active. */
	isActive: boolean;
	/** Whether the tab has unsaved changes. */
	isDirty: boolean;
	/** Whether the tab is locked by another user. */
	isLocked: boolean;
	/** User who has the lock. */
	lockUser: LockUser | null;
	/** Callback when tab is clicked. */
	onClick: () => void;
	/** Callback when close button is clicked. */
	onClose: () => void;
	/** Callback when context menu is requested. */
	onContextMenu: (event: React.MouseEvent, tabKey: string) => void;
}

/**
 * Tabs bar component props.
 */
export interface TabsBarProps {
	/** Array of tabs to display. */
	tabs: Tab[];
	/** Currently active tab key. */
	activeTabKey: string | null;
	/** Callback when tab is clicked. */
	onTabClick: (tabKey: string) => void;
	/** Callback when tab close is requested. */
	onTabClose: (tabKey: string) => void;
	/** Callback when context menu is opened. */
	onContextMenu: (event: React.MouseEvent, tabKey: string) => void;
	/** Function to check if a tab is dirty. */
	getIsDirty: (postType: string, postId: string | number) => boolean;
	/** Function to check if a tab is locked. */
	isTabLocked: (tabKey: string) => boolean;
	/** Function to get lock user for a tab. */
	getLockUser: (tabKey: string) => LockUser | null;
}
