/**
 * External dependencies
 */
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	DragStartEvent,
} from '@dnd-kit/core';
import {
	SortableContext,
	sortableKeyboardCoordinates,
	horizontalListSortingStrategy,
	arrayMove,
} from '@dnd-kit/sortable';
import type { Modifier } from '@dnd-kit/core';

/**
 * WordPress dependencies
 */
import { Button, Tooltip } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import {
	useRef,
	useEffect,
	useLayoutEffect,
	useCallback,
	memo,
	useMemo,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { displayShortcut } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import SortableTab from './SortableTab';
import ToolbarContextMenu from './ToolbarContextMenu';
import { WORKSPACE_TABS_TEST_ID } from '../constants/testIds';
import { useScrollbar, defaultScrollbarOptions } from '../../scrollbar';
import { UpgradePrompt } from '@blockera/controls';
import type {
	Tab as TabType,
	LockUser,
	RecentlyClosedTab,
	TabsLimitExceededType,
} from '../types';

/**
 * Tabs bar props.
 */
export interface TabsBarProps {
	/** Array of pinned tabs. */
	pinnedTabs: TabType[];
	/** Array of unpinned tabs. */
	unpinnedTabs: TabType[];
	/** Key of active tab. */
	activeTabKey: string | null;
	/** Function to check if a tab is dirty. */
	getIsDirty: (postType: string, postId: string | number) => boolean;
	/** Function to check if a tab is locked. */
	isTabLocked?: (tabKey: string) => boolean;
	/** Function to get the lock user for a tab. */
	getLockUser?: (tabKey: string) => LockUser | null;
	/** Tab click handler. */
	onTabClick: (tabKey: string) => void;
	/** Tab close handler. */
	onTabClose: (tabKey: string) => void;
	/** Add button click handler. */
	onAddClick: () => void;
	/** Handler for close others action. */
	onCloseOthers: (tabKey: string) => void;
	/** Handler for close to right action. */
	onCloseToRight: (tabKey: string) => void;
	/** Handler for close saved action. */
	onCloseSaved: () => void;
	/** Handler for view action. */
	onView?: () => void;
	/** Handler for copy view link action. */
	onCopyViewLink?: () => void;
	/** Handler for copy editor link action. */
	onCopyEditorLink?: () => void;
	/** Handler for pin/unpin toggle. */
	onTogglePin: (tabKey: string) => void;
	/** Handler for rename action. */
	onRename: (tabKey: string) => void;
	/** Handler for clear rename action. */
	onClearRename: (tabKey: string) => void;
	/** Whether persistence is enabled. */
	isPersistenceEnabled: boolean;
	/** Handler for toggling persistence. */
	onTogglePersistence: () => void;
	/** Whether recently closed tabs persistence is enabled. */
	isRecentlyClosedPersistenceEnabled: boolean;
	/** Handler for toggling recently closed tabs persistence. */
	onToggleRecentlyClosedPersistence: () => void;
	/** Whether tab icons are enabled. */
	isTabIconsEnabled: boolean;
	/** Handler for toggling tab icons. */
	onToggleTabIcons: () => void;
	/** Whether icon-only pinned tabs are enabled. */
	isIconOnlyPinnedTabsEnabled: boolean;
	/** Handler for toggling icon-only pinned tabs. */
	onToggleIconOnlyPinnedTabs: () => void;
	/** Recently closed tabs. */
	recentlyClosedTabs: RecentlyClosedTab[];
	/** Handler for reopening a tab. */
	onReopenTab: (tabKey: string) => void;
	/** Handler for updating closed tab. */
	onUpdateClosedTab: (
		tabKey: string,
		updates: {
			title?: string;
			status?: string | null;
			slug?: string | null;
		}
	) => void;
	/** Handler for removing closed tab. */
	onRemoveClosedTab: (tabKey: string) => void;
	/** Handler for reordering tabs. Receives new pinned and unpinned arrays. */
	onReorderTabs: (pinnedTabs: TabType[], unpinnedTabs: TabType[]) => void;
	/** Which tab limit is currently exceeded. */
	limitExceededType: TabsLimitExceededType;
	/** Handler for closing promotion popover. */
	onCloseLimitPromotion: () => void;
}

/**
 * TabsBar component.
 *
 * Wrapped with React.memo to prevent unnecessary re-renders when parent re-renders
 * but meaningful props haven't changed.
 */
const TabsBar = memo(function TabsBar({
	pinnedTabs,
	unpinnedTabs,
	activeTabKey,
	getIsDirty,
	isTabLocked = () => false,
	getLockUser = () => null,
	onTabClick,
	onTabClose,
	onAddClick,
	onCloseOthers,
	onCloseToRight,
	onCloseSaved,
	onView,
	onCopyViewLink,
	onCopyEditorLink,
	onTogglePin,
	onRename,
	onClearRename,
	isPersistenceEnabled,
	onTogglePersistence,
	isRecentlyClosedPersistenceEnabled,
	onToggleRecentlyClosedPersistence,
	isTabIconsEnabled,
	onToggleTabIcons,
	isIconOnlyPinnedTabsEnabled,
	onToggleIconOnlyPinnedTabs,
	recentlyClosedTabs,
	onReopenTab,
	onUpdateClosedTab,
	onRemoveClosedTab,
	onReorderTabs,
	limitExceededType,
	onCloseLimitPromotion,
}: TabsBarProps): React.ReactElement {
	const tabsContainerRef = useRef<HTMLDivElement>(null);
	const tabsBarRef = useRef<HTMLDivElement>(null);
	const addTabButtonAnchorRef = useRef<HTMLDivElement>(null);

	/**
	 * Indicator position tracking refs:
	 * - previousActiveTabPositionRef: Stores the last known position of the active tab
	 *   Used to calculate animation start position when switching tabs
	 * - previousActiveTabKeyRef: Tracks the previous active tab key to detect tab switches
	 * - isDraggingActiveTabRef: Tracks if the active tab is currently being dragged
	 *   Prevents animation after drag since indicator is already attached to the tab
	 */
	const previousActiveTabPositionRef = useRef<{
		left: number;
		width: number;
	} | null>(null);
	const previousActiveTabKeyRef = useRef<string | null>(null);
	const isDraggingActiveTabRef = useRef<boolean>(false);

	const pinnedCount = pinnedTabs.length;
	const unpinnedCount = unpinnedTabs.length;

	/*
	 * Memoize combined tabs array to prevent unnecessary re-renders.
	 * Only recreate when tab keys or order actually changes.
	 */
	const sortedTabs = useMemo(() => {
		return [...pinnedTabs, ...unpinnedTabs];
	}, [pinnedTabs, unpinnedTabs]);

	// Memoize scrollbar options to prevent recreation on every render
	const scrollbarOptions = useMemo(
		() => ({
			...defaultScrollbarOptions,
			scrollbars: {
				...defaultScrollbarOptions.scrollbars,
				theme: 'os-theme-dark blockera-tabs',
			},
			overflow: {
				x: 'scroll' as const,
				y: 'hidden' as const,
			},
		}),
		[]
	);

	// Apply OverlayScrollbars to tabs container and force recalculation
	// on tab structure/selection changes for immediate visual sync.
	useScrollbar(tabsBarRef, scrollbarOptions, [
		sortedTabs.length,
		pinnedCount,
		unpinnedCount,
	]);

	// Check if a tab can be dragged (needs 2+ tabs in its group)
	const canDragTab = useCallback(
		(tab: TabType): boolean => {
			if (tab.isPinned) {
				return pinnedCount >= 2;
			}
			return unpinnedCount >= 2;
		},
		[pinnedCount, unpinnedCount]
	);

	// Configure sensors with activation constraints
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	// Custom modifier to restrict drag movement to horizontal axis only
	const restrictToHorizontalAxis: Modifier = ({ transform }) => {
		return {
			...transform,
			y: 0,
		};
	};

	/**
	 * Helper function to calculate tab position relative to container
	 * Memoized to avoid recreating on every render
	 */
	const calculateTabPosition = useCallback(
		(tabElement: HTMLElement, container: HTMLDivElement) => {
			const containerRect = container.getBoundingClientRect();
			const tabRect = tabElement.getBoundingClientRect();
			return {
				left: tabRect.left - containerRect.left + container.scrollLeft,
				width: tabRect.width,
			};
		},
		[]
	);

	/**
	 * Ensure active tab stays visible inside horizontal viewport.
	 * Works with both native overflow and OverlayScrollbars viewport.
	 */
	const ensureActiveTabVisible = useCallback(() => {
		if (!activeTabKey) {
			return;
		}

		const container = tabsContainerRef.current;
		if (!container) {
			return;
		}

		const activeTabElement = container.querySelector(
			`.blockera-tabs-tab.is-active[data-tab-key="${activeTabKey}"]`
		) as HTMLElement | null;

		if (!activeTabElement) {
			return;
		}

		const tabsBarElement = tabsBarRef.current;
		const scrollContainer = tabsBarElement || container;

		const viewportRect = scrollContainer.getBoundingClientRect();
		const activeTabRect = activeTabElement.getBoundingClientRect();
		const isLeftOverflow = activeTabRect.left < viewportRect.left;
		const isRightOverflow = activeTabRect.right > viewportRect.right;

		// Scroll only when active tab is outside visible horizontal bounds.
		if (isLeftOverflow) {
			scrollContainer.scrollLeft -=
				viewportRect.left - activeTabRect.left;
			return;
		}

		if (isRightOverflow) {
			scrollContainer.scrollLeft +=
				activeTabRect.right - viewportRect.right;
		}
	}, [activeTabKey]);

	/**
	 * Animates the indicator from old tab position to new tab position
	 *
	 * How it works:
	 * 1. Hide tab's ::before indicator, show container ::before indicator
	 * 2. Set container indicator to old position (no transition for instant positioning)
	 * 3. Force reflow to ensure initial position is applied
	 * 4. Enable transition and animate to new position
	 * 5. After animation completes, hide container indicator and show tab indicator
	 *
	 * This creates a smooth visual transition that appears to move from one tab to another
	 */
	const animateIndicator = useCallback(
		(
			fromLeft: number,
			fromWidth: number,
			toLeft: number,
			toWidth: number
		) => {
			const container = tabsContainerRef.current;
			if (!container) {
				return;
			}

			// Step 1: Switch from tab indicator to container indicator (synchronous)
			// This hides the tab's ::before and shows the container's ::before
			container.classList.add('is-animating-indicator');

			// Step 2: Set initial position without transition (synchronous)
			// This ensures the indicator appears instantly at the old position
			container.style.setProperty('--indicator-transition', 'none');
			container.style.setProperty('--active-tab-left', `${fromLeft}px`);
			container.style.setProperty('--active-tab-width', `${fromWidth}px`);

			// Step 3: Wait for browser to apply initial styles, then animate
			requestAnimationFrame(() => {
				if (!tabsContainerRef.current) {
					return;
				}

				// Force reflow to ensure initial position is painted before animating
				// This prevents the browser from skipping the transition
				// eslint-disable-next-line no-unused-expressions
				tabsContainerRef.current.offsetHeight;

				// Step 4: Re-enable transition and animate to target position
				// The browser will now smoothly transition from old to new position
				tabsContainerRef.current.style.removeProperty(
					'--indicator-transition'
				);
				tabsContainerRef.current.style.setProperty(
					'--active-tab-left',
					`${toLeft}px`
				);
				tabsContainerRef.current.style.setProperty(
					'--active-tab-width',
					`${toWidth}px`
				);

				// Step 5: After animation completes, switch back to tab indicator
				const transitionDuration = 300; // Match CSS transition duration (0.3s)
				setTimeout(() => {
					if (tabsContainerRef.current) {
						tabsContainerRef.current.classList.remove(
							'is-animating-indicator'
						);
						// Tab indicator will now be visible again (attached to active tab)
					}
				}, transitionDuration);
			});
		},
		[]
	);

	/**
	 * Handle drag start event
	 * Tracks whether the active tab is being dragged to prevent unnecessary animations
	 * When active tab is dragged, its indicator stays attached and moves naturally
	 */
	const handleDragStart = useCallback(
		(event: DragStartEvent): void => {
			const draggedTabKey = event.active.id as string;
			isDraggingActiveTabRef.current = draggedTabKey === activeTabKey;
		},
		[activeTabKey]
	);

	/**
	 * Handle drag end event - reorders tabs and updates indicator position
	 *
	 * Logic:
	 * 1. If tabs were reordered, update the tab order using arrayMove
	 * 2. If active tab was dragged, update its position ref after DOM settles
	 *    (prevents animation since indicator is already attached and in correct position)
	 * 3. Reset drag tracking flag
	 */
	const handleDragEnd = useCallback(
		(event: DragEndEvent): void => {
			const { active, over } = event;
			const wasActiveTabDragged = isDraggingActiveTabRef.current;

			// Handle reordering if tabs were actually moved
			if (over && active.id !== over.id) {
				const draggedTabKey = active.id as string;
				const targetTabKey = over.id as string;

				// Find which group (pinned/unpinned) contains the dragged tab
				const draggedIndexInPinned = pinnedTabs.findIndex(
					(t) => t.key === draggedTabKey
				);
				const draggedIndexInUnpinned = unpinnedTabs.findIndex(
					(t) => t.key === draggedTabKey
				);

				// Determine source group and index
				const isPinned = draggedIndexInPinned !== -1;
				const sourceGroup = isPinned ? pinnedTabs : unpinnedTabs;
				const draggedIndex = isPinned
					? draggedIndexInPinned
					: draggedIndexInUnpinned;

				// Find target index in the same group
				const targetIndex = sourceGroup.findIndex(
					(t) => t.key === targetTabKey
				);

				if (draggedIndex !== -1 && targetIndex !== -1) {
					// Reorder using arrayMove (handles the array manipulation)
					const reorderedGroup = arrayMove(
						sourceGroup,
						draggedIndex,
						targetIndex
					);

					// Update via callback (triggers React re-render)
					if (isPinned) {
						onReorderTabs(reorderedGroup, unpinnedTabs);
					} else {
						onReorderTabs(pinnedTabs, reorderedGroup);
					}
				}
			}

			// If active tab was dragged, update its position ref after DOM updates
			// This prevents the tab-switch useEffect from triggering animation
			// The indicator is already attached to the tab and in the correct position
			if (
				wasActiveTabDragged &&
				tabsContainerRef.current &&
				activeTabKey
			) {
				// Use double RAF to ensure DOM has fully updated after reordering
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						const container = tabsContainerRef.current;
						if (!container) {
							isDraggingActiveTabRef.current = false;
							return;
						}

						const activeTabElement = container.querySelector(
							`.blockera-tabs-tab.is-active[data-tab-key="${activeTabKey}"]`
						) as HTMLElement | null;

						if (activeTabElement) {
							// Update position ref to current position (no animation needed)
							previousActiveTabPositionRef.current =
								calculateTabPosition(
									activeTabElement,
									container
								);
						}
						// Reset drag tracking after updating position
						isDraggingActiveTabRef.current = false;
					});
				});
			} else {
				// Reset drag tracking immediately if active tab wasn't dragged
				isDraggingActiveTabRef.current = false;
			}
		},
		[
			pinnedTabs,
			unpinnedTabs,
			onReorderTabs,
			activeTabKey,
			calculateTabPosition,
		]
	);

	/**
	 * Capture previous active tab position BEFORE React updates DOM
	 *
	 * Uses useLayoutEffect to run synchronously before browser paint.
	 * This is critical: we need to capture the old tab's position while it still
	 * has the .is-active class, before React removes it.
	 *
	 * How it works:
	 * - When activeTabKey changes, this runs BEFORE React updates the DOM
	 * - If tab is switching, captures old tab's position (still has .is-active)
	 * - Sets previousActiveTabPositionRef which signals the useEffect to animate
	 * - If not switching, clears the ref to prevent animation
	 */
	useLayoutEffect(() => {
		const container = tabsContainerRef.current;
		if (!container) {
			// Still update the key even if container doesn't exist yet
			if (activeTabKey) {
				previousActiveTabKeyRef.current = activeTabKey;
			}
			return;
		}

		// Skip if currently animating (don't interfere with ongoing animation)
		if (container.classList.contains('is-animating-indicator')) {
			if (activeTabKey) {
				previousActiveTabKeyRef.current = activeTabKey;
			}
			return;
		}

		const oldActiveTabKey = previousActiveTabKeyRef.current;
		const isTabSwitching =
			oldActiveTabKey !== null && oldActiveTabKey !== activeTabKey;

		if (isTabSwitching && oldActiveTabKey && activeTabKey) {
			// Tab is switching: capture OLD tab's position BEFORE it loses .is-active
			// This is the key: we can still query for .is-active[data-tab-key="${oldActiveTabKey}"]
			// because React hasn't updated the DOM yet (useLayoutEffect runs synchronously)
			const oldActiveTabElement = container.querySelector(
				`.blockera-tabs-tab.is-active[data-tab-key="${oldActiveTabKey}"]`
			) as HTMLElement | null;

			if (oldActiveTabElement) {
				// Store position for animation start point
				previousActiveTabPositionRef.current = calculateTabPosition(
					oldActiveTabElement,
					container
				);
			}
		} else if (!isTabSwitching && activeTabKey) {
			// Not switching tabs (e.g., same tab, just position changed due to sorting)
			// Clear previous position to prevent animation
			previousActiveTabPositionRef.current = null;
		}

		// Update previous active tab key AFTER capturing position
		previousActiveTabKeyRef.current = activeTabKey;
	}, [activeTabKey, calculateTabPosition]);

	/**
	 * Handle active tab change - animate indicator ONLY when switching tabs
	 *
	 * This effect runs AFTER React updates the DOM (new tab has .is-active).
	 *
	 * Detection logic:
	 * - If previousActiveTabPositionRef exists, useLayoutEffect captured it during tab switch
	 * - This is our signal that a tab switch occurred (not just sorting)
	 *
	 * Behavior:
	 * - Tab switching: Animates indicator from old tab to new tab
	 * - Sorting: Skips animation (indicator stays attached to tab)
	 * - Dragging active tab: Skips animation (indicator already attached)
	 */
	useEffect(() => {
		const container = tabsContainerRef.current;
		if (!container || !activeTabKey) {
			return;
		}

		// Skip if currently animating (don't start new animation during existing one)
		if (container.classList.contains('is-animating-indicator')) {
			return;
		}

		// Skip if we just finished dragging the active tab
		// Indicator is already attached and in correct position, no animation needed
		if (isDraggingActiveTabRef.current) {
			return;
		}

		// Check if tab is switching by checking if position was captured
		// useLayoutEffect only sets this when switching tabs (not during sorting)
		const previousPosition = previousActiveTabPositionRef.current;
		const isTabSwitching = previousPosition !== null;

		// ONLY animate when switching tabs
		if (isTabSwitching && previousPosition) {
			// Wait for DOM to fully update (new tab has .is-active now)
			requestAnimationFrame(() => {
				// Double-check conditions (may have changed between frames)
				if (!tabsContainerRef.current || !activeTabKey) {
					return;
				}

				if (isDraggingActiveTabRef.current) {
					return;
				}

				// Find new active tab element
				const activeTabElement = tabsContainerRef.current.querySelector(
					`.blockera-tabs-tab.is-active[data-tab-key="${activeTabKey}"]`
				) as HTMLElement | null;

				if (!activeTabElement) {
					return;
				}

				// Calculate new position
				const newPosition = calculateTabPosition(
					activeTabElement,
					tabsContainerRef.current
				);

				// Only animate if positions are significantly different (>1px threshold)
				// This prevents unnecessary animations for tiny position changes
				if (
					Math.abs(previousPosition.left - newPosition.left) > 1 ||
					Math.abs(previousPosition.width - newPosition.width) > 1
				) {
					animateIndicator(
						previousPosition.left,
						previousPosition.width,
						newPosition.left,
						newPosition.width
					);
				}

				// Update stored position after animation starts
				previousActiveTabPositionRef.current = newPosition;
			});
		}
	}, [activeTabKey, animateIndicator, calculateTabPosition]);

	/**
	 * Update position ref when tabs are sorted (no animation)
	 *
	 * When tabs are reordered, the active tab's position may change, but we don't
	 * want to animate because the indicator is attached to the tab and moves naturally.
	 *
	 * This effect:
	 * - Only runs when sortedTabs changes (not when activeTabKey changes)
	 * - Silently updates the position ref for future reference
	 * - Skips if tab switch animation is in progress
	 */
	useEffect(() => {
		const container = tabsContainerRef.current;
		if (!container || !activeTabKey) {
			return;
		}

		// Skip if currently animating (tab switch animation takes priority)
		if (container.classList.contains('is-animating-indicator')) {
			return;
		}

		// Skip if we just finished dragging the active tab
		// Position will be updated by handleDragEnd
		if (isDraggingActiveTabRef.current) {
			return;
		}

		// Skip if tab is switching (previousPosition exists means switch is in progress)
		// The tab-switch effect will handle position update after animation
		if (previousActiveTabPositionRef.current !== null) {
			return;
		}

		// Update position ref silently (no animation)
		// Tab indicator is attached and moves naturally with the tab during sorting
		requestAnimationFrame(() => {
			if (!tabsContainerRef.current || !activeTabKey) {
				return;
			}

			const activeTabElement = tabsContainerRef.current.querySelector(
				`.blockera-tabs-tab.is-active[data-tab-key="${activeTabKey}"]`
			) as HTMLElement | null;

			if (activeTabElement) {
				previousActiveTabPositionRef.current = calculateTabPosition(
					activeTabElement,
					tabsContainerRef.current
				);
			}
		});
	}, [sortedTabs, activeTabKey, calculateTabPosition]);

	/**
	 * Update stored position on scroll or resize events
	 *
	 * When the container scrolls or window resizes, the active tab's position changes.
	 * The tab indicator stays attached and moves naturally, so we just update the ref
	 * for future reference (no animation needed).
	 *
	 * Performance: Uses passive event listeners where possible for better scroll performance
	 */
	useEffect(() => {
		const container = tabsContainerRef.current;
		if (!container) {
			return;
		}

		// Skip if currently animating (don't interfere with animation)
		if (container.classList.contains('is-animating-indicator')) {
			return;
		}

		/**
		 * Handle scroll or resize events
		 * Updates position ref silently - tab indicator moves naturally with the tab
		 */
		const handleScrollOrResize = () => {
			if (!container || !activeTabKey) {
				return;
			}

			const activeTabElement = container.querySelector(
				`.blockera-tabs-tab.is-active[data-tab-key="${activeTabKey}"]`
			) as HTMLElement | null;

			if (activeTabElement) {
				previousActiveTabPositionRef.current = calculateTabPosition(
					activeTabElement,
					container
				);
			}
		};

		// Add event listeners
		// Note: scroll events on elements don't support passive option in all browsers
		container.addEventListener('scroll', handleScrollOrResize);
		window.addEventListener('resize', handleScrollOrResize, {
			passive: true,
		});

		return () => {
			container.removeEventListener('scroll', handleScrollOrResize);
			window.removeEventListener('resize', handleScrollOrResize);
		};
	}, [activeTabKey, calculateTabPosition]);

	/**
	 * Keep active tab in view after initial render and active tab/order changes.
	 * Double RAF allows DOM and custom scrollbar viewport to settle first.
	 */
	useEffect(() => {
		if (!activeTabKey) {
			return;
		}

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				ensureActiveTabVisible();
			});
		});
	}, [activeTabKey, sortedTabs, ensureActiveTabVisible]);

	// Memoize tab IDs for sortable contexts to prevent unnecessary re-renders
	// Only recreate when tab keys or order actually changes
	const pinnedTabIds = useMemo(
		() => pinnedTabs.map((tab) => tab.key),
		[pinnedTabs]
	);
	const unpinnedTabIds = useMemo(
		() => unpinnedTabs.map((tab) => tab.key),
		[unpinnedTabs]
	);

	const limitPromotionContent = useMemo(() => {
		if (limitExceededType === 'pinned') {
			return {
				heading: __('More pinned tabs in Pro', 'blockera'),
				featuresList: [
					__('Unlimited pinned tabs', 'blockera'),
					__('Faster access to key documents', 'blockera'),
					__('Power-user tab workflows', 'blockera'),
				],
			};
		}

		if (limitExceededType === 'regular') {
			return {
				heading: __('More open tabs in Pro', 'blockera'),
				featuresList: [
					__('Unlimited regular tabs', 'blockera'),
					__('Keep larger editing sessions open', 'blockera'),
					__('Boost multi-document productivity', 'blockera'),
				],
			};
		}

		return null;
	}, [limitExceededType]);

	return (
		<>
			<div className="blockera-tabs-bar" ref={tabsBarRef}>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
					modifiers={[restrictToHorizontalAxis]}
				>
					<div
						className="blockera-tabs-bar-tabs"
						ref={tabsContainerRef}
					>
						{/* Pinned tabs sortable context */}
						{pinnedTabs.length > 0 && (
							<SortableContext
								items={pinnedTabIds}
								strategy={horizontalListSortingStrategy}
							>
								<div className="blockera-tabs-bar-tabs__pinned-tabs">
									{pinnedTabs.map((tab) => (
										<SortableTab
											key={tab.key}
											id={tab.key}
											canDrag={canDragTab(tab)}
											tab={tab}
											isActive={tab.key === activeTabKey}
											isPinned={true}
											isLocked={isTabLocked(tab.key)}
											lockUser={getLockUser(tab.key)}
											tabs={sortedTabs}
											getIsDirty={getIsDirty}
											onClick={() => onTabClick(tab.key)}
											onClose={() => onTabClose(tab.key)}
											onCloseOthers={() =>
												onCloseOthers(tab.key)
											}
											onCloseToRight={() =>
												onCloseToRight(tab.key)
											}
											onCloseSaved={onCloseSaved}
											onView={onView}
											onCopyViewLink={onCopyViewLink}
											onCopyEditorLink={onCopyEditorLink}
											onTogglePin={() =>
												onTogglePin(tab.key)
											}
											onRename={() => onRename(tab.key)}
											onClearRename={() =>
												onClearRename(tab.key)
											}
											isTabIconsEnabled={
												isTabIconsEnabled
											}
											isIconOnlyPinnedTabsEnabled={
												isIconOnlyPinnedTabsEnabled
											}
										/>
									))}
								</div>
							</SortableContext>
						)}

						{/* Unpinned tabs sortable context */}
						{unpinnedTabs.length > 0 && (
							<SortableContext
								items={unpinnedTabIds}
								strategy={horizontalListSortingStrategy}
							>
								<div className="blockera-tabs-bar-tabs__normal-tabs">
									{unpinnedTabs.map((tab) => (
										<SortableTab
											key={tab.key}
											id={tab.key}
											canDrag={canDragTab(tab)}
											tab={tab}
											isActive={tab.key === activeTabKey}
											isPinned={false}
											isLocked={isTabLocked(tab.key)}
											lockUser={getLockUser(tab.key)}
											tabs={sortedTabs}
											getIsDirty={getIsDirty}
											onClick={() => onTabClick(tab.key)}
											onClose={() => onTabClose(tab.key)}
											onCloseOthers={() =>
												onCloseOthers(tab.key)
											}
											onCloseToRight={() =>
												onCloseToRight(tab.key)
											}
											onCloseSaved={onCloseSaved}
											onView={onView}
											onCopyViewLink={onCopyViewLink}
											onCopyEditorLink={onCopyEditorLink}
											onTogglePin={() =>
												onTogglePin(tab.key)
											}
											onRename={() => onRename(tab.key)}
											onClearRename={() =>
												onClearRename(tab.key)
											}
											isTabIconsEnabled={
												isTabIconsEnabled
											}
											isIconOnlyPinnedTabsEnabled={
												isIconOnlyPinnedTabsEnabled
											}
										/>
									))}
								</div>
							</SortableContext>
						)}
					</div>
				</DndContext>

				<div className="blockera-tabs-bar-actions">
					<Tooltip
						text={__('Add new tab', 'blockera')}
						shortcut={displayShortcut.ctrl('t')}
					>
						<div ref={addTabButtonAnchorRef}>
							<Button
								icon={plus}
								onClick={onAddClick}
								variant="tertiary"
								size="compact"
								aria-label={__('Add new tab', 'blockera')}
								{...({
									'test-id': WORKSPACE_TABS_TEST_ID.add,
								} as Record<string, string>)}
							/>
						</div>
					</Tooltip>

					{limitPromotionContent && (
						<UpgradePrompt
							heading={limitPromotionContent.heading}
							featuresList={limitPromotionContent.featuresList}
							isOpen={!!limitExceededType}
							onClose={onCloseLimitPromotion}
							type="modal"
							placement="bottom-end"
							offset={12}
							anchor={addTabButtonAnchorRef.current ?? undefined}
							disableHintsText={false}
							{...({
								'data-test':
									WORKSPACE_TABS_TEST_ID.tabsLimitUpgradePrompt,
							} as Record<string, string>)}
						/>
					)}
				</div>
			</div>

			<div className="blockera-tabs-bar-settings">
				<div className="blockera-tabs-bar-actions">
					<Tooltip
						text={__('Add new tab', 'blockera')}
						shortcut={displayShortcut.ctrl('t')}
					>
						<Button
							icon={plus}
							onClick={onAddClick}
							variant="tertiary"
							size="compact"
							aria-label={__('Add new tab', 'blockera')}
						/>
					</Tooltip>
				</div>

				<ToolbarContextMenu
					isPersistenceEnabled={isPersistenceEnabled}
					onTogglePersistence={onTogglePersistence}
					isRecentlyClosedPersistenceEnabled={
						isRecentlyClosedPersistenceEnabled
					}
					onToggleRecentlyClosedPersistence={
						onToggleRecentlyClosedPersistence
					}
					isTabIconsEnabled={isTabIconsEnabled}
					onToggleTabIcons={onToggleTabIcons}
					isIconOnlyPinnedTabsEnabled={isIconOnlyPinnedTabsEnabled}
					onToggleIconOnlyPinnedTabs={onToggleIconOnlyPinnedTabs}
					recentlyClosedTabs={recentlyClosedTabs}
					onReopenTab={onReopenTab}
					onUpdateClosedTab={onUpdateClosedTab}
					onRemoveClosedTab={onRemoveClosedTab}
				/>
			</div>
		</>
	);
});

export default TabsBar;
