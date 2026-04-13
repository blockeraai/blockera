/**
 * WordPress dependencies
 */
import { Popover, MenuGroup, MenuItem } from '@wordpress/components';
import { external, link, pin, pencil } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { WORKSPACE_TABS_TEST_ID } from '../constants/testIds';
import { sortTabsByPinned } from '../utils/tabActions';
import type { Tab as TabType } from '../types';

const testIdAttrs = (id: string): Record<string, string> => ({
	'test-id': id,
});

/**
 * Context menu position.
 */
interface ContextMenuPosition {
	element?: HTMLElement;
	x?: number;
	y?: number;
}

/**
 * Tab context menu props.
 */
export interface TabContextMenuProps {
	/** Tab object. */
	tab: TabType;
	/** Whether menu is open. */
	isOpen: boolean;
	/** Close handler. */
	onClose: () => void;
	/** Position object { x, y } or anchor element. */
	position?: ContextMenuPosition | null;
	/** Editor URL for the tab. */
	editorUrl?: string | null;
	/** View URL for the tab. */
	viewUrl?: string | null;
	/** Whether tab has unsaved changes. */
	isDirty?: boolean;
	/** Array of all tabs. */
	tabs?: TabType[];
	/** Function to check if a tab is dirty. */
	getIsDirty?: (postType: string, postId: string | number) => boolean;
	/** Handler for close action. */
	onCloseTab?: () => void;
	/** Handler for close others action. */
	onCloseOthers?: () => void;
	/** Handler for close to right action. */
	onCloseToRight?: () => void;
	/** Handler for close saved action. */
	onCloseSaved?: () => void;
	/** Handler for view action. */
	onView?: () => void;
	/** Handler for copy view link action. */
	onCopyViewLink?: () => void;
	/** Handler for copy editor link action. */
	onCopyEditorLink?: () => void;
	/** Handler for pin/unpin toggle. */
	onTogglePin?: () => void;
	/** Handler for rename action. */
	onRename?: () => void;
	/** Handler for clear rename action. */
	onClearRename?: () => void;
}

/**
 * Copy text to clipboard with fallback
 *
 * @param text - Text to copy
 * @return True if successful
 */
async function copyToClipboard(text: string): Promise<boolean> {
	if (!text) {
		return false;
	}

	try {
		// Modern clipboard API
		if (navigator.clipboard && navigator.clipboard.writeText) {
			await navigator.clipboard.writeText(text);
			return true;
		}

		// Fallback for older browsers
		const textarea = document.createElement('textarea');
		textarea.value = text;
		textarea.style.position = 'fixed';
		textarea.style.opacity = '0';
		document.body.appendChild(textarea);
		textarea.select();

		try {
			const success = document.execCommand('copy');
			document.body.removeChild(textarea);
			return success;
		} catch {
			document.body.removeChild(textarea);
			return false;
		}
	} catch {
		return false;
	}
}

/**
 * Tab Context Menu Component
 */
export default function TabContextMenu({
	tab,
	isOpen,
	onClose,
	position,
	editorUrl,
	viewUrl,
	tabs = [],
	getIsDirty,
	onCloseTab,
	onCloseOthers,
	onCloseToRight,
	onCloseSaved,
	onView,
	onCopyViewLink,
	onCopyEditorLink,
	onTogglePin,
	onRename,
	onClearRename,
}: TabContextMenuProps): React.ReactElement | null {
	if (!isOpen) {
		return null;
	}

	const isPinned = tab?.isPinned ?? false;
	// Pinned tabs cannot be closed
	// Also disable if there's only 1 tab total (but allow closing if there are pinned tabs and only 1 unpinned)
	const canClose = !isPinned && tabs.length > 1;

	// Calculate if there are closable (unpinned) tabs to the right
	// Sort tabs: pinned first, then unpinned (preserve relative order within each group)
	const sortedTabs = sortTabsByPinned(tabs);
	const targetIndex = sortedTabs.findIndex((t) => t.key === tab?.key);
	// Check if there are any unpinned (closable) tabs to the right
	const tabsToRight =
		targetIndex !== -1 ? sortedTabs.slice(targetIndex + 1) : [];
	const hasTabsToRight = tabsToRight.some((t) => !t.isPinned);

	// Calculate if there are other tabs (excluding pinned tabs and current tab)
	const otherUnpinnedTabs = tabs.filter(
		(t) => !t.isPinned && t.key !== tab?.key
	);
	const hasOtherTabs = otherUnpinnedTabs.length > 0;

	// Calculate if there are any dirty tabs (excluding pinned tabs)
	const hasDirtyTabs = tabs.some(
		(t) => !t.isPinned && getIsDirty && getIsDirty(t.type, t.id)
	);

	const handleClose = (e?: React.MouseEvent): void => {
		e?.preventDefault?.();
		e?.stopPropagation?.();
		if (canClose && onCloseTab) {
			onCloseTab();
		}
		// Use setTimeout to ensure action completes before closing
		setTimeout(() => {
			onClose();
		}, 0);
	};

	const handleCloseOthers = (e?: React.MouseEvent): void => {
		e?.preventDefault?.();
		e?.stopPropagation?.();
		onCloseOthers?.();
		setTimeout(() => {
			onClose();
		}, 0);
	};

	const handleCloseToRight = (e?: React.MouseEvent): void => {
		e?.preventDefault?.();
		e?.stopPropagation?.();
		onCloseToRight?.();
		setTimeout(() => {
			onClose();
		}, 0);
	};

	const handleCloseSaved = (e?: React.MouseEvent): void => {
		e?.preventDefault?.();
		e?.stopPropagation?.();
		onCloseSaved?.();
		setTimeout(() => {
			onClose();
		}, 0);
	};

	const handleView = (e?: React.MouseEvent): void => {
		e?.preventDefault?.();
		e?.stopPropagation?.();
		if (viewUrl) {
			onView?.();
		}
		setTimeout(() => {
			onClose();
		}, 0);
	};

	const handleCopyViewLink = async (e?: React.MouseEvent): Promise<void> => {
		e?.preventDefault?.();
		e?.stopPropagation?.();
		if (viewUrl) {
			await copyToClipboard(viewUrl);
			onCopyViewLink?.();
		}
		setTimeout(() => {
			onClose();
		}, 0);
	};

	const handleCopyEditorLink = async (
		e?: React.MouseEvent
	): Promise<void> => {
		e?.preventDefault?.();
		e?.stopPropagation?.();
		if (editorUrl) {
			await copyToClipboard(editorUrl);
			onCopyEditorLink?.();
		}
		setTimeout(() => {
			onClose();
		}, 0);
	};

	const handleTogglePin = (e?: React.MouseEvent): void => {
		e?.preventDefault?.();
		e?.stopPropagation?.();
		onTogglePin?.();
		setTimeout(() => {
			onClose();
		}, 0);
	};

	const handleRename = (e?: React.MouseEvent): void => {
		e?.preventDefault?.();
		e?.stopPropagation?.();
		if (onRename) {
			onRename();
		}
		setTimeout(() => {
			onClose();
		}, 0);
	};

	const handleClearRename = (e?: React.MouseEvent): void => {
		e?.preventDefault?.();
		e?.stopPropagation?.();
		if (onClearRename) {
			onClearRename();
		}
		setTimeout(() => {
			onClose();
		}, 0);
	};

	// Check if tab is renamed
	const isRenamed = Boolean(
		tab?.customTitle && tab.customTitle.trim() !== ''
	);

	// Determine anchor - use element reference if available, otherwise undefined
	const anchor = position?.element;

	return (
		<Popover
			onClose={onClose}
			position="bottom left"
			anchor={anchor}
			offset={8}
			className="blockera-tabs-context-menu"
			{...testIdAttrs(WORKSPACE_TABS_TEST_ID.tabContextMenu)}
		>
			<MenuGroup>
				<MenuItem
					onClick={handleClose}
					disabled={!canClose}
					shortcut={!canClose && isPinned ? 'Pinned' : undefined}
					tabIndex={canClose ? undefined : -1}
					{...testIdAttrs(WORKSPACE_TABS_TEST_ID.contextMenuClose)}
				>
					Close
				</MenuItem>
				<MenuItem
					onClick={handleCloseOthers}
					disabled={!hasOtherTabs}
					tabIndex={hasOtherTabs ? undefined : -1}
					{...testIdAttrs(
						WORKSPACE_TABS_TEST_ID.contextMenuCloseOthers
					)}
				>
					Close others
				</MenuItem>
				<MenuItem
					onClick={handleCloseToRight}
					disabled={!hasTabsToRight}
					tabIndex={hasTabsToRight ? undefined : -1}
					{...testIdAttrs(
						WORKSPACE_TABS_TEST_ID.contextMenuCloseToRight
					)}
				>
					Close to the right
				</MenuItem>
				<MenuItem
					onClick={handleCloseSaved}
					disabled={!hasDirtyTabs}
					tabIndex={hasDirtyTabs ? undefined : -1}
					{...testIdAttrs(
						WORKSPACE_TABS_TEST_ID.contextMenuCloseSaved
					)}
				>
					Close saved
				</MenuItem>
			</MenuGroup>
			<MenuGroup>
				<MenuItem
					onClick={handleView}
					disabled={!viewUrl}
					icon={external}
					tabIndex={viewUrl ? undefined : -1}
					{...testIdAttrs(WORKSPACE_TABS_TEST_ID.contextMenuView)}
				>
					View
				</MenuItem>
				<MenuItem
					onClick={handleCopyViewLink}
					disabled={!viewUrl}
					icon={link}
					tabIndex={viewUrl ? undefined : -1}
					{...testIdAttrs(
						WORKSPACE_TABS_TEST_ID.contextMenuCopyViewLink
					)}
				>
					Copy view link
				</MenuItem>
				<MenuItem
					onClick={handleCopyEditorLink}
					disabled={!editorUrl}
					icon={link}
					tabIndex={editorUrl ? undefined : -1}
					{...testIdAttrs(
						WORKSPACE_TABS_TEST_ID.contextMenuCopyEditorLink
					)}
				>
					Copy editor link
				</MenuItem>
			</MenuGroup>
			<MenuGroup>
				<MenuItem
					onClick={handleRename}
					icon={pencil}
					{...testIdAttrs(
						WORKSPACE_TABS_TEST_ID.contextMenuRenameTab
					)}
				>
					Rename tab
				</MenuItem>
				{isRenamed && (
					<MenuItem
						onClick={handleClearRename}
						style={{ color: '#cc1818' }}
						{...testIdAttrs(
							WORKSPACE_TABS_TEST_ID.contextMenuClearTabRename
						)}
					>
						Clear tab rename
					</MenuItem>
				)}
			</MenuGroup>
			<MenuGroup>
				<MenuItem
					onClick={handleTogglePin}
					icon={pin}
					style={isPinned ? { color: '#cc1818' } : undefined}
					{...testIdAttrs(
						isPinned
							? WORKSPACE_TABS_TEST_ID.contextMenuUnpin
							: WORKSPACE_TABS_TEST_ID.contextMenuPin
					)}
				>
					{isPinned ? 'Unpin' : 'Pin'}
				</MenuItem>
			</MenuGroup>
		</Popover>
	);
}
