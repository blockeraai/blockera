/**
 * WordPress dependencies
 */
import { Button, Tooltip, Icon } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import {
	closeSmall,
	drafts,
	pending,
	notAllowed,
	trash,
	scheduled,
	lock,
} from '@wordpress/icons';
import {
	useState,
	useRef,
	useEffect,
	useMemo,
	memo,
	forwardRef,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useEntity } from '../../hooks';
import { getTabIcon } from '../utils/getTabIcon';
import TabContextMenu from './TabContextMenu';
import type { Tab as TabType, LockUser } from '../types';

/**
 * Tab component props.
 */
export interface TabComponentProps {
	/** Tab object. */
	tab: TabType;
	/** Whether this tab is active. */
	isActive: boolean;
	/** Whether this tab has unsaved changes. */
	hasUnsavedChanges: boolean;
	/** Whether this tab is pinned. */
	isPinned?: boolean;
	/** Whether this tab is locked by another user. */
	isLocked?: boolean;
	/** User who has locked the tab. */
	lockUser?: LockUser | null;
	/** Array of all tabs. */
	tabs?: TabType[];
	/** Function to check if a tab is dirty. */
	getIsDirty?: (postType: string, postId: string | number) => boolean;
	/** Click handler. */
	onClick: () => void;
	/** Close handler. */
	onClose: () => void;
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
	/** Whether to show tab icons (type/status). Lock icon is always shown when locked. */
	isTabIconsEnabled?: boolean;
	/** Whether icon-only mode for pinned tabs is enabled. */
	isIconOnlyPinnedTabsEnabled?: boolean;
	/** Whether this tab can be dragged (2+ tabs in group). */
	canDrag?: boolean;
	/** Whether this tab is currently being dragged. */
	isDragging?: boolean;
	/** Optional inline styles for the tab. */
	style?: React.CSSProperties;
	/** Drag and drop attributes from dnd-kit (for internal use). */
	dragAttributes?: React.HTMLAttributes<HTMLDivElement>;
	/** Drag and drop listeners from dnd-kit (for internal use). */
	dragListeners?: React.HTMLAttributes<HTMLDivElement>;
}

/**
 * Context menu position.
 */
interface ContextMenuPosition {
	element?: HTMLDivElement;
	x?: number;
	y?: number;
}

/**
 * Custom comparison function for Tab memo.
 * Compares only data props that affect rendering, ignoring function props.
 */
function areTabRenderPropsEqual(
	prevProps: TabComponentProps,
	nextProps: TabComponentProps
): boolean {
	// Compare style prop - critical for drag transforms
	// Handle cases where style might be undefined
	const prevStyle = prevProps.style;
	const nextStyle = nextProps.style;
	const styleEqual =
		(prevStyle === undefined && nextStyle === undefined) ||
		(prevStyle !== undefined &&
			nextStyle !== undefined &&
			prevStyle.transform === nextStyle.transform &&
			prevStyle.transition === nextStyle.transition);

	return (
		prevProps.tab.key === nextProps.tab.key &&
		prevProps.tab.type === nextProps.tab.type &&
		prevProps.tab.id === nextProps.tab.id &&
		prevProps.tab.title === nextProps.tab.title &&
		prevProps.tab.customTitle === nextProps.tab.customTitle &&
		prevProps.tab.slug === nextProps.tab.slug &&
		prevProps.tab.status === nextProps.tab.status &&
		prevProps.tab.isPinned === nextProps.tab.isPinned &&
		prevProps.isActive === nextProps.isActive &&
		prevProps.hasUnsavedChanges === nextProps.hasUnsavedChanges &&
		prevProps.isPinned === nextProps.isPinned &&
		prevProps.isLocked === nextProps.isLocked &&
		prevProps.isTabIconsEnabled === nextProps.isTabIconsEnabled &&
		prevProps.isIconOnlyPinnedTabsEnabled ===
			nextProps.isIconOnlyPinnedTabsEnabled &&
		prevProps.tabs?.length === nextProps.tabs?.length &&
		prevProps.lockUser?.id === nextProps.lockUser?.id &&
		prevProps.canDrag === nextProps.canDrag &&
		prevProps.isDragging === nextProps.isDragging &&
		styleEqual
	);
}

/**
 * Tab component
 *
 * Wrapped with React.memo using custom comparison to prevent unnecessary re-renders
 * when parent re-renders but meaningful props haven't changed.
 */
const Tab = memo(
	forwardRef<HTMLDivElement, TabComponentProps>(function Tab(
		{
			tab,
			isActive,
			hasUnsavedChanges,
			isPinned = false,
			isLocked = false,
			lockUser = null,
			tabs = [],
			getIsDirty,
			onClick,
			onClose,
			onCloseOthers,
			onCloseToRight,
			onCloseSaved,
			onTogglePin,
			onRename,
			onClearRename,
			isTabIconsEnabled = true,
			isIconOnlyPinnedTabsEnabled = false,
			canDrag = false,
			isDragging = false,
			style,
			dragAttributes,
			dragListeners,
		},
		ref
	): React.ReactElement {
		const [contextMenuOpen, setContextMenuOpen] = useState(false);
		const [contextMenuPosition, setContextMenuPosition] =
			useState<ContextMenuPosition | null>(null);
		const tabRef = useRef<HTMLDivElement>(null);
		// Use forwarded ref if provided, otherwise use internal ref
		const elementRef = ref || tabRef;

		// Subscribe to entity stores only when context menu is open.
		// During regular tab rendering we rely on cached tab values to avoid
		// high-frequency editor store subscriptions that can stall tab switching.
		const shouldSubscribeToEntity = contextMenuOpen;
		const entity = useEntity(
			shouldSubscribeToEntity ? tab.type : null,
			shouldSubscribeToEntity ? tab.id : null
		);

		// Display priority: customTitle -> entity.title -> tab.title
		const displayTitle = tab.customTitle || entity.title || tab.title;
		const status = entity.status || tab.status;
		const editorUrl = shouldSubscribeToEntity ? entity.editorUrl : null;
		const viewUrl = shouldSubscribeToEntity ? entity.viewUrl : null;
		// Check if tab has a custom title (is renamed)
		const isRenamed = Boolean(
			tab.customTitle && tab.customTitle.trim() !== ''
		);

		// Check if this pinned tab should be icon-only (hide title, show only icon)
		const isIconOnly = isPinned && isIconOnlyPinnedTabsEnabled;

		// Handle context menu (right-click)
		const handleContextMenu = (e: React.MouseEvent): void => {
			e.preventDefault();
			e.stopPropagation();

			// Set position relative to tab element
			if (tabRef.current) {
				setContextMenuPosition({
					element: tabRef.current,
				});
			} else {
				// Fallback to cursor position
				setContextMenuPosition({
					x: e.clientX,
					y: e.clientY,
				});
			}

			setContextMenuOpen(true);
		};

		// Handle keyboard shortcut for context menu (Shift+F10 or ContextMenu key)
		const handleKeyDown = (e: React.KeyboardEvent): void => {
			if ((e.shiftKey && e.key === 'F10') || e.key === 'ContextMenu') {
				e.preventDefault();
				handleContextMenu(e as unknown as React.MouseEvent);
			} else if (e.key === 'Enter' || e.key === ' ') {
				// Activate tab on Enter or Space
				e.preventDefault();
				onClick();
			}
		};

		// Handle double-click to open rename modal
		const handleDoubleClick = (e: React.MouseEvent): void => {
			e.preventDefault();
			e.stopPropagation();
			if (onRename) {
				onRename();
			}
		};

		// Close context menu on Escape key
		useEffect(() => {
			if (!contextMenuOpen) {
				return;
			}

			const handleEscape = (e: KeyboardEvent): void => {
				if (e.key === 'Escape') {
					setContextMenuOpen(false);
				}
			};

			document.addEventListener('keydown', handleEscape);

			return () => {
				document.removeEventListener('keydown', handleEscape);
			};
		}, [contextMenuOpen]);

		// Resolved tab "type" icon (post type / site editor template kind).
		// This is shown only when icons are enabled, the tab is not locked,
		// and there is no status icon taking precedence.
		// Memoized to avoid recalculating on every re-render since tab.type/slug rarely change.
		const typeIcon = useMemo(
			() => getTabIcon({ postType: tab.type, slug: tab.slug }),
			[tab.type, tab.slug]
		);

		// Get status icon
		// Using 'any' for icon type as WordPress icons have complex union types
		const getStatusIcon = (
			postStatus: string
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		): any => {
			switch (postStatus) {
				case 'future':
				case 'scheduled':
					return scheduled;
				case 'draft':
					return drafts;
				case 'pending':
					return pending;
				case 'private':
					return notAllowed;
				case 'trash':
					return trash;
				default:
					return null;
			}
		};

		const statusIcon = status ? getStatusIcon(status) : null;

		const handleView = (): void => {
			if (viewUrl) {
				window.open(viewUrl, '_blank', 'noopener,noreferrer');
			}
		};

		const handleCopyViewLink = (): void => {
			// Clipboard operation is handled in TabContextMenu
			// This is just a callback for potential notifications
		};

		const handleCopyEditorLink = (): void => {
			// Clipboard operation is handled in TabContextMenu
			// This is just a callback for potential notifications
		};

		return (
			<>
				<div
					ref={elementRef as React.RefObject<HTMLDivElement>}
					data-tab-key={tab.key}
					className={`blockera-tabs-tab ${
						isActive ? 'is-active' : ''
					} ${isPinned ? 'is-pinned' : ''} ${
						isRenamed ? 'renamed-tab' : ''
					} ${isLocked ? 'is-locked' : ''} ${
						isTabIconsEnabled || isIconOnly ? 'show-icons' : ''
					} ${isIconOnly ? 'is-icon-only' : ''} ${
						canDrag ? 'is-draggable' : ''
					} ${isDragging ? 'is-dragging' : ''}`}
					role="tab"
					tabIndex={-1}
					aria-selected={isActive}
					style={style}
					{...dragAttributes}
					{...dragListeners}
					onContextMenu={handleContextMenu}
					onKeyDown={handleKeyDown}
					onDoubleClick={handleDoubleClick}
				>
					<Button
						onClick={() => {
							// Prevent click if currently dragging
							if (!isDragging) {
								onClick();
							}
						}}
						className="blockera-tabs-tab-button"
						variant="tertiary"
						onPointerDown={
							canDrag && dragListeners?.onPointerDown
								? (e) => {
										// Call the drag listener to start drag when clicking button
										if (dragListeners.onPointerDown) {
											(
												dragListeners.onPointerDown as any
											)(e);
										}
									}
								: undefined
						}
						tabIndex={0}
					>
						{/* Lock icon takes priority over status/type icons */}
						{isLocked && (
							<Tooltip
								text={sprintf(
									/* translators: %s: User's display name */
									__('Locked by %s', 'blockera'),
									lockUser?.name ||
										__('another user', 'blockera')
								)}
							>
								<span className="blockera-tabs-tab-icon lock-icon">
									<Icon icon={lock} size={22} />
								</span>
							</Tooltip>
						)}

						{/* Status icon (only if not locked) */}
						{/* Show when icons enabled OR when in icon-only mode for pinned tabs */}
						{(isTabIconsEnabled || isIconOnly) &&
							!isLocked &&
							statusIcon && (
								<span className="blockera-tabs-tab-icon status-icon">
									<Icon icon={statusIcon} size={22} />
								</span>
							)}

						{/* Template type icon (only if not locked and no status icon) */}
						{/* Show when icons enabled OR when in icon-only mode for pinned tabs */}
						{(isTabIconsEnabled || isIconOnly) &&
							!isLocked &&
							!statusIcon &&
							typeIcon && (
								<span className="blockera-tabs-tab-icon type-icon">
									<Icon icon={typeIcon} size={22} />
								</span>
							)}

						{/* Hide title when icon-only mode is enabled for pinned tabs */}
						{!isIconOnly && (
							<span className="blockera-tabs-tab-title">
								{displayTitle}
							</span>
						)}

						{hasUnsavedChanges && (
							<span className="blockera-tabs-unsaved-indicator" />
						)}
					</Button>

					{!isPinned && (
						<Button
							icon={closeSmall}
							onClick={(e) => {
								e.stopPropagation();
								onClose();
							}}
							onKeyDown={(e) => {
								// Handle Enter and Space keys to trigger close
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									e.stopPropagation(); // Prevent parent's handleKeyDown from firing
									onClose();
								}
							}}
							className="blockera-tabs-tab-close"
							size="small"
							variant="tertiary"
							tabIndex={0}
						/>
					)}
				</div>

				{contextMenuOpen && (
					<TabContextMenu
						tab={tab}
						isOpen={contextMenuOpen}
						onClose={() => setContextMenuOpen(false)}
						position={contextMenuPosition}
						editorUrl={editorUrl}
						viewUrl={viewUrl}
						isDirty={hasUnsavedChanges}
						tabs={tabs}
						getIsDirty={getIsDirty}
						onCloseTab={onClose}
						onCloseOthers={onCloseOthers}
						onCloseToRight={onCloseToRight}
						onCloseSaved={onCloseSaved}
						onView={handleView}
						onCopyViewLink={handleCopyViewLink}
						onCopyEditorLink={handleCopyEditorLink}
						onTogglePin={onTogglePin}
						onRename={onRename}
						onClearRename={onClearRename}
					/>
				)}
			</>
		);
	})
);

// Apply memo with custom comparison
const MemoizedTab = memo(Tab, areTabRenderPropsEqual);
export default MemoizedTab;
