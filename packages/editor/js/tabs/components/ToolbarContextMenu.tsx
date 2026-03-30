/**
 * WordPress dependencies
 */
import { DropdownMenu, MenuGroup, MenuItem, Icon } from '@wordpress/components';
import { moreVertical, check } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';
import { memo, useRef, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { WORKSPACE_TABS_TEST_ID } from '../constants/testIds';
import type { RecentlyClosedTab } from '../types';
import { getTabIcon } from '../utils/getTabIcon';
import { useEntity } from '../../hooks';

/**
 * Toolbar context menu props.
 */
export interface ToolbarContextMenuProps {
	/** Whether tab persistence is enabled. */
	isPersistenceEnabled: boolean;
	/** Handler for toggling tab persistence. */
	onTogglePersistence: () => void;
	/** Whether recently closed persistence is enabled. */
	isRecentlyClosedPersistenceEnabled: boolean;
	/** Handler for toggling recently closed persistence. */
	onToggleRecentlyClosedPersistence: () => void;
	/** Whether tab icons are enabled. */
	isTabIconsEnabled: boolean;
	/** Handler for toggling tab icons visibility. */
	onToggleTabIcons: () => void;
	/** Whether icon-only mode for pinned tabs is enabled. */
	isIconOnlyPinnedTabsEnabled: boolean;
	/** Handler for toggling icon-only mode for pinned tabs. */
	onToggleIconOnlyPinnedTabs: () => void;
	/** Array of recently closed tabs. */
	recentlyClosedTabs?: RecentlyClosedTab[];
	/** Handler for reopening a closed tab. */
	onReopenTab: (tabKey: string) => Promise<void> | void;
	/** Handler to update a closed tab's data when entity changes. */
	onUpdateClosedTab?: (
		tabKey: string,
		updates: {
			title?: string;
			status?: string | null;
			slug?: string | null;
		}
	) => void;
	/** Handler to remove a closed tab when entity is deleted. */
	onRemoveClosedTab?: (tabKey: string) => void;
}

/**
 * Props for RecentlyClosedTabItem component.
 */
interface RecentlyClosedTabItemProps {
	/** The recently closed tab. */
	tab: RecentlyClosedTab;
	/** Handler for reopening the tab. */
	onReopenTab: (tabKey: string) => void;
	/** Handler to close the dropdown. */
	onClose: () => void;
	/** Handler to update storage when entity data changes. */
	onUpdateClosedTab?: (
		tabKey: string,
		updates: {
			title?: string;
			status?: string | null;
			slug?: string | null;
		}
	) => void;
	/** Handler to remove a tab when entity is deleted. */
	onRemoveClosedTab?: (tabKey: string) => void;
}

/**
 * Recently Closed Tab Item Component
 *
 * Displays a recently closed tab in the dropdown menu.
 * Fetches current entity data to show up-to-date title/status,
 * falling back to stored values if entity is not in store.
 * Updates storage when entity data changes.
 * Removes the tab if the entity has been permanently deleted.
 */
const RecentlyClosedTabItem = memo(function RecentlyClosedTabItem({
	tab,
	onReopenTab,
	onClose,
	onUpdateClosedTab,
	onRemoveClosedTab,
}: RecentlyClosedTabItemProps): React.ReactElement | null {
	// Try to get current entity data from store
	// Falls back to stored values if entity isn't loaded
	const entity = useEntity(tab.type, tab.id);

	// Check if entity has been permanently deleted
	// hasResolved means the fetch completed, and if record is null, the entity doesn't exist
	const isDeleted = entity.hasResolved && !entity.record;

	// Use current entity title if available, otherwise use stored title
	const title = entity.title || tab.title || tab.key;

	// Use current entity status if available, otherwise use stored status
	const status = entity.status || tab.status;

	// Use current entity slug for icon if available, otherwise use stored slug
	const slug = entity.slug || tab.slug;

	// Ref to track previous values and avoid duplicate updates
	const prevValuesRef = useRef({
		title: tab.title,
		status: tab.status,
		slug: tab.slug,
	});

	// Remove from storage if entity is deleted
	useEffect(() => {
		if (isDeleted && onRemoveClosedTab) {
			onRemoveClosedTab(tab.key);
		}
	}, [isDeleted, tab.key, onRemoveClosedTab]);

	// Update storage when entity data differs from stored data
	// This keeps storage up-to-date for future sessions
	useEffect(() => {
		// Skip if entity is deleted or no update handler
		if (isDeleted || !onUpdateClosedTab) {
			return;
		}

		const updates: {
			title?: string;
			status?: string | null;
			slug?: string | null;
		} = {};
		let hasChanges = false;

		// Check if entity title is available and different from stored
		if (entity.title && entity.title !== tab.title) {
			updates.title = entity.title;
			hasChanges = true;
		}

		// Check if entity status is available and different from stored
		if (entity.status && entity.status !== tab.status) {
			updates.status = entity.status;
			hasChanges = true;
		}

		// Check if entity slug is available and different from stored
		if (entity.slug && entity.slug !== tab.slug) {
			updates.slug = entity.slug;
			hasChanges = true;
		}

		// Only update if there are actual changes and values are different from last update
		if (hasChanges) {
			const prev = prevValuesRef.current;
			if (
				updates.title !== prev.title ||
				updates.status !== prev.status ||
				updates.slug !== prev.slug
			) {
				prevValuesRef.current = {
					title: updates.title ?? tab.title,
					status: updates.status ?? tab.status,
					slug: updates.slug ?? tab.slug,
				};
				onUpdateClosedTab(tab.key, updates);
			}
		}
	}, [
		isDeleted,
		entity.title,
		entity.status,
		entity.slug,
		tab.key,
		tab.title,
		tab.status,
		tab.slug,
		onUpdateClosedTab,
	]);

	// Don't render if entity is deleted
	if (isDeleted) {
		return null;
	}

	const tabIcon = getTabIcon({
		postType: tab.type,
		slug,
	});

	// Show status badge if not published
	const showStatus = status && status !== 'publish';

	const handleClick = (e?: React.MouseEvent): void => {
		e?.preventDefault?.();
		e?.stopPropagation?.();
		// Handle async onReopenTab - catch any errors silently
		try {
			const result = onReopenTab(tab.key);
			// If result is a Promise, catch any errors
			const promise = result as Promise<void> | void | null | undefined;
			if (promise && typeof promise === 'object' && 'catch' in promise) {
				promise.catch(() => {
					// Silently handle errors - tab reopening failed
				});
			}
		} catch {
			// Silently handle synchronous errors
		}
		onClose();
	};

	return (
		<MenuItem
			onClick={handleClick}
			className={`blockera-tabs-toolbar-menu-item__closed-tab ${
				status ? 'status-' + status : ''
			}`}
			suffix={
				tab.closedAt ? (
					<span className="blockera-tabs-closed-time">
						{shortTimeDiff(tab.closedAt)}
					</span>
				) : null
			}
		>
			<Icon
				icon={tabIcon}
				size={20}
				className="blockera-tabs-closed-tab-icon"
			/>
			<span className="blockera-tabs-closed-tab-title">{title}</span>
			{showStatus && (
				<span className="blockera-tabs-closed-tab-status">
					{status}
				</span>
			)}
		</MenuItem>
	);
});

/**
 * Format time difference in short format (e.g., "2m ago", "1h ago")
 *
 * @param timestamp - Timestamp in milliseconds or ISO date string
 * @return Formatted time difference
 */
function shortTimeDiff(timestamp: number | string): string {
	const date =
		typeof timestamp === 'number'
			? timestamp
			: new Date(timestamp).getTime();
	const diffMs = Date.now() - date;
	const diffSeconds = Math.floor(diffMs / 1000);

	if (diffSeconds < 60) {
		return __('now', 'blockera');
	}

	const diffMinutes = Math.floor(diffSeconds / 60);
	if (diffMinutes < 60) {
		/* translators: %d: number of minutes */
		return sprintf(__('%dm ago', 'blockera'), diffMinutes);
	}

	const diffHours = Math.floor(diffMinutes / 60);
	if (diffHours < 24) {
		/* translators: %d: number of hours */
		return sprintf(__('%dh ago', 'blockera'), diffHours);
	}

	const diffDays = Math.floor(diffHours / 24);
	/* translators: %d: number of days */
	return sprintf(__('%dd ago', 'blockera'), diffDays);
}

/**
 * Toolbar Context Menu Component
 *
 * Displays a dropdown menu in the tabs bar with:
 * 1. Tabs Settings - persistence toggles for tabs and recently closed tabs
 * 2. Recently Closed Tabs - list of closed tabs that can be reopened
 */
export default function ToolbarContextMenu({
	isPersistenceEnabled,
	onTogglePersistence,
	isRecentlyClosedPersistenceEnabled,
	onToggleRecentlyClosedPersistence,
	isTabIconsEnabled,
	onToggleTabIcons,
	isIconOnlyPinnedTabsEnabled,
	onToggleIconOnlyPinnedTabs,
	recentlyClosedTabs = [],
	onReopenTab,
	onUpdateClosedTab,
	onRemoveClosedTab,
}: ToolbarContextMenuProps): React.ReactElement {
	const handleTogglePersistence = (onClose: () => void): void => {
		onTogglePersistence();
		onClose();
	};

	const handleToggleRecentlyClosedPersistence = (
		onClose: () => void
	): void => {
		onToggleRecentlyClosedPersistence();
		onClose();
	};

	const handleToggleTabIcons = (onClose: () => void): void => {
		onToggleTabIcons();
		onClose();
	};

	const handleToggleIconOnlyPinnedTabs = (onClose: () => void): void => {
		onToggleIconOnlyPinnedTabs();
		onClose();
	};

	return (
		<DropdownMenu
			icon={<Icon icon={moreVertical} size={24} />}
			label={__('Tabs options', 'blockera')}
			className="blockera-tabs-toolbar-menu"
			toggleProps={
				{
					'test-id': WORKSPACE_TABS_TEST_ID.toolbarMenuTrigger,
				} as Record<string, string>
			}
			popoverProps={{
				className: 'blockera-tabs-toolbar-menu-popover',
				placement: 'bottom-end',
			}}
		>
			{({ onClose }) => (
				<>
					<MenuGroup label={__('Tabs History Settings', 'blockera')}>
						<MenuItem
							icon={isPersistenceEnabled ? check : undefined}
							onClick={() => handleTogglePersistence(onClose)}
							role="menuitemcheckbox"
							info={__(
								'Your open tabs stay available after refreshing the editor.',
								'blockera'
							)}
							className={
								isPersistenceEnabled ? 'is-active-item' : ''
							}
						>
							{__('Keep tabs open after refresh', 'blockera')}
						</MenuItem>
						<MenuItem
							icon={
								isRecentlyClosedPersistenceEnabled
									? check
									: undefined
							}
							onClick={() =>
								handleToggleRecentlyClosedPersistence(onClose)
							}
							role="menuitemcheckbox"
							info={__(
								'Keep up to 20 closed tabs so you can reopen them anytime.',
								'blockera'
							)}
							className={
								isRecentlyClosedPersistenceEnabled
									? 'is-active-item'
									: ''
							}
						>
							{__('Remember recently closed tabs', 'blockera')}
						</MenuItem>
					</MenuGroup>

					<MenuGroup label={__('Tabs Display Settings', 'blockera')}>
						<MenuItem
							icon={isTabIconsEnabled ? check : undefined}
							onClick={() => handleToggleTabIcons(onClose)}
							role="menuitemcheckbox"
							info={__(
								'Show an icon next to each tab title to help identify tab types.',
								'blockera'
							)}
							className={
								isTabIconsEnabled ? 'is-active-item' : ''
							}
						>
							{__('Show tab icons', 'blockera')}
						</MenuItem>
						<MenuItem
							icon={
								isIconOnlyPinnedTabsEnabled ? check : undefined
							}
							onClick={() =>
								handleToggleIconOnlyPinnedTabs(onClose)
							}
							role="menuitemcheckbox"
							info={__(
								'Show only the icon for pinned tabs, hiding the title.',
								'blockera'
							)}
							className={
								isIconOnlyPinnedTabsEnabled
									? 'is-active-item'
									: ''
							}
							{...({
								'test-id':
									WORKSPACE_TABS_TEST_ID.toolbarIconOnlyPinnedTabs,
							} as Record<string, string>)}
						>
							{__('Icon-only pinned tabs', 'blockera')}
						</MenuItem>
					</MenuGroup>

					<MenuGroup
						label={__('Recently Closed Tabs', 'blockera')}
						className="blockera-tabs-toolbar-menu-group__closed-tabs"
					>
						{recentlyClosedTabs.length === 0 ? (
							<MenuItem disabled>
								{__('No recently closed tabs', 'blockera')}
							</MenuItem>
						) : (
							recentlyClosedTabs.map((tab) => (
								<RecentlyClosedTabItem
									key={tab.key}
									tab={tab}
									onReopenTab={onReopenTab}
									onClose={onClose}
									onUpdateClosedTab={onUpdateClosedTab}
									onRemoveClosedTab={onRemoveClosedTab}
								/>
							))
						)}
					</MenuGroup>
				</>
			)}
		</DropdownMenu>
	);
}
