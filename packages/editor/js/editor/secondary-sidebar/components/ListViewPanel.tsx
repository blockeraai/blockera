/**
 * WordPress dependencies
 */
import {
	__experimentalListView as ListView,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { ESCAPE, displayShortcut, rawShortcut } from '@wordpress/keycodes';
import { store as editorStore } from '@wordpress/editor';
import {
	useFocusOnMount,
	useMergeRefs,
	useKeyboardShortcut,
} from '@wordpress/compose';
import { focus } from '@wordpress/dom';
import { __, _x } from '@wordpress/i18n';
import {
	useShortcut,
	store as keyboardShortcutsStore,
} from '@wordpress/keyboard-shortcuts';
import { Button, __experimentalText as Text } from '@wordpress/components';
import { useCallback, useRef, useState, useEffect } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Tabs } from '@blockera/controls';

/**
 * Expand all icon SVG component.
 */
const ExpandAllIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M17 15.0714L12 19L7 15.0714L7.81818 14L12 17.2143L16.0909 14L17 15.0714Z" />
		<path d="M7 8.92857L12 5L17 8.92857L16.1818 10L12 6.78571L7.90909 10L7 8.92857Z" />
	</svg>
);

/**
 * Collapse all icon SVG component.
 */
const CollapseAllIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M7 16.9286L12 13L17 16.9286L16.1818 18L12 14.7857L7.90909 18L7 16.9286Z" />
		<path d="M17 7.07143L12 11L7 7.07143L7.81818 6L12 9.21429L16.0909 6L17 7.07143Z" />
	</svg>
);

/**
 * Collapse all others icon SVG component.
 */
const CollapseAllOthersIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M7 18.9286L12 15L17 18.9286L16.1818 20L12 16.7857L7.90909 20L7 18.9286Z" />
		<path d="M17 5.07143L12 9L7 5.07143L7.81818 4L12 7.21429L16.0909 4L17 5.07143Z" />
		<path d="M7 11.3499L11.9805 11.35L17 11.3499L17 12.6497L11.9805 12.6499L7 12.6497L7 11.3499Z" />
	</svg>
);

/**
 * List view outline component showing document statistics and outline.
 * Note: This is a simplified version. The full implementation would require
 * access to internal editor components (CharacterCount, WordCount, TimeToRead, DocumentOutline).
 * For now, we'll render a placeholder that matches the structure.
 */
function ListViewOutline() {
	return (
		<div className="editor-list-view-sidebar__outline">
			{/* Placeholder for outline content - can be enhanced later */}
			<div>
				<Text>{__('Document Outline', 'blockera')}</Text>
			</div>
		</div>
	);
}

/**
 * List view panel component that displays tabs for list view and outline.
 */
export default function ListViewPanel() {
	// All hooks must be called before any conditional returns
	// List view sidebar logic
	const { setIsListViewOpened } = useDispatch(editorStore) as any;
	const { registerShortcut } = useDispatch(keyboardShortcutsStore);
	const { clearSelectedBlock } = useDispatch(blockEditorStore);

	// Get selected block ID reactively
	const selectedBlockId = useSelect((select) => {
		const blockEditorSelect = select(blockEditorStore) as any;
		return blockEditorSelect.getSelectedBlockClientId?.() || null;
	}, []);

	// Get block navigation selectors
	const blockEditorSelectors = useSelect((select) => {
		const blockEditorSelect = select(blockEditorStore) as any;

		return {
			getSelectedBlockClientId: () =>
				blockEditorSelect.getSelectedBlockClientId?.() || null,
			getPreviousBlockClientId: (clientId: string) =>
				blockEditorSelect.getPreviousBlockClientId?.(clientId) || null,
			getNextBlockClientId: (clientId: string) =>
				blockEditorSelect.getNextBlockClientId?.(clientId) || null,
			getBlockParents: (clientId: string, ascending: boolean = false) =>
				blockEditorSelect.getBlockParents?.(clientId, ascending) || [],
			getBlock: (clientId: string) =>
				blockEditorSelect.getBlock?.(clientId) || null,
			getBlocks: (rootClientId: string | null) =>
				blockEditorSelect.getBlocks?.(rootClientId) || [],
		};
	}, []);

	const getListViewToggleRef = useSelect((select) => {
		const editorSelect = select(editorStore) as any;
		return editorSelect.getListViewToggleRef?.() || { current: null };
	}, []);

	const focusOnMountRef = useFocusOnMount('firstElement');
	const [dropZoneElement, setDropZoneElement] = useState<HTMLElement | null>(
		null
	);
	const [tab, setTab] = useState('list-view');

	const sidebarRef = useRef<HTMLDivElement>(null);
	const listViewRef = useRef<HTMLDivElement>(null);
	const listViewContentRef = useRef<HTMLDivElement>(null);

	const listViewContainerRef = useMergeRefs([
		focusOnMountRef,
		listViewRef,
		setDropZoneElement,
	]);

	const closeListView = useCallback(() => {
		setIsListViewOpened?.(false);
		getListViewToggleRef?.current?.focus();
	}, [getListViewToggleRef, setIsListViewOpened]);

	const closeListViewOnEscape = useCallback(
		(event: KeyboardEvent) => {
			if (event.keyCode === ESCAPE && !event.defaultPrevented) {
				event.preventDefault();
				closeListView();
			}
		},
		[closeListView]
	);

	function handleSidebarFocus(currentTab: string) {
		const tabPanelFocus = focus.tabbable.find(
			sidebarRef.current || null
		)[0];
		if (currentTab === 'list-view') {
			const listViewApplicationFocus = focus.tabbable.find(
				listViewRef.current || null
			)[0];
			const listViewFocusArea = sidebarRef.current?.contains(
				listViewApplicationFocus
			)
				? listViewApplicationFocus
				: tabPanelFocus;
			listViewFocusArea?.focus();
		} else {
			tabPanelFocus?.focus();
		}
	}

	const handleToggleListViewShortcut = useCallback(() => {
		if (
			sidebarRef.current?.contains(
				sidebarRef.current.ownerDocument.activeElement
			)
		) {
			closeListView();
		} else {
			handleSidebarFocus(tab);
		}
	}, [closeListView, tab]);

	useShortcut('core/editor/toggle-list-view', handleToggleListViewShortcut);

	// Handle expand all by clicking all collapsed items recursively (deep expansion)
	const handleExpandAll = useCallback(() => {
		// Only work when list view tab is active
		if (tab !== 'list-view' || !listViewContentRef.current) {
			return;
		}

		// Recursive function to expand all nested levels
		// Uses setTimeout to allow DOM updates between iterations
		const expandRecursively = (iteration: number = 0) => {
			if (!listViewContentRef.current || iteration > 50) {
				// Safety limit to prevent infinite loops
				return;
			}

			const collapsedExpanders =
				listViewContentRef.current.querySelectorAll(
					'a[aria-expanded="false"] > [data-testid="list-view-expander"]'
				) as NodeListOf<HTMLButtonElement>;

			if (collapsedExpanders.length === 0) {
				// No more collapsed items, we're done
				return;
			}

			// Click all collapsed expander buttons
			collapsedExpanders.forEach((button) => {
				button.click();
			});

			// Wait for DOM to update, then check again for newly revealed nested items
			setTimeout(() => {
				expandRecursively(iteration + 1);
			}, 10);
		};

		expandRecursively();
	}, [tab]);

	// Handle collapse all others (Alt+L behavior) - fires the Alt+L shortcut
	const handleCollapseAllOthers = useCallback(() => {
		// Only work when list view tab is active
		if (tab !== 'list-view' || !listViewContentRef.current) {
			return;
		}

		// Check if there's a selected block
		const currentSelectedBlockId =
			blockEditorSelectors.getSelectedBlockClientId();

		if (currentSelectedBlockId) {
			// Trigger the "Collapse all other items" behavior
			// by simulating the Alt+L keyboard event on the selected block's row.
			// The list view's onKeyDown handler uses isMatch to detect this shortcut and will:
			// 1. Collapse all blocks
			// 2. Expand all parents of the selected block
			// This matches exactly how the shortcut works when pressed manually.
			const treeGrid = listViewContentRef.current?.querySelector(
				'[role="treegrid"]'
			) as HTMLElement | null;

			if (treeGrid) {
				// Find the currently selected/focused list item row within the tree grid
				// The onKeyDown handler is attached to individual ListViewLeaf components (TreeGridRow)
				// We need to find the row that corresponds to the selected block
				const selectedRow = listViewContentRef.current?.querySelector(
					`[data-block="${currentSelectedBlockId}"]`
				) as HTMLElement | null;

				// Use the selected row if found, otherwise use the tree grid
				const targetElement = selectedRow || treeGrid;

				// Create a keyboard event that matches the Alt+L shortcut
				// The shortcut is registered as: modifier: 'alt', character: 'l'
				const keyboardEvent = new KeyboardEvent('keydown', {
					key: 'l',
					code: 'KeyL',
					keyCode: 76,
					which: 76,
					altKey: true,
					bubbles: true,
					cancelable: true,
					composed: true,
				});

				// Dispatch the event on the target element so the list view's onKeyDown handler catches it
				// The event will bubble up if needed
				targetElement.dispatchEvent(keyboardEvent);
			}
		}
	}, [tab, blockEditorSelectors]);

	// Handle collapse all by clicking all expanded items (expander buttons with aria-expanded="true")
	const handleCollapseAll = useCallback(() => {
		// Only work when list view tab is active
		if (tab !== 'list-view' || !listViewContentRef.current) {
			return;
		}

		// Deselect the active block if any is selected
		const currentSelectedBlockId =
			blockEditorSelectors.getSelectedBlockClientId();
		if (currentSelectedBlockId) {
			clearSelectedBlock();
		}

		// Proceed with normal collapse all
		const expandedExpanders = listViewContentRef.current.querySelectorAll(
			'a[aria-expanded="true"] > [data-testid="list-view-expander"]'
		) as NodeListOf<HTMLButtonElement>;

		// Click in reverse order to avoid issues with DOM changes during collapse
		Array.from(expandedExpanders)
			.reverse()
			.forEach((button) => {
				button.click();
			});
	}, [tab, blockEditorSelectors, clearSelectedBlock]);

	// Register keyboard shortcuts in the shortcuts store so they appear in the shortcuts modal
	useEffect(() => {
		// Expand all: Option (Alt) + Command (Ctrl) + ]
		registerShortcut({
			name: 'blockera/list-view/expand-all',
			category: 'blockera',
			description: __('Expand all blocks in the list view.', 'blockera'),
			keyCombination: {
				modifier: 'primaryAlt',
				character: ']',
			},
		});

		// Collapse all: Option (Alt) + Command (Ctrl) + [
		registerShortcut({
			name: 'blockera/list-view/collapse-all',
			category: 'blockera',
			description: __(
				'Collapse all blocks in the list view.',
				'blockera'
			),
			keyCombination: {
				modifier: 'primaryAlt',
				character: '[',
			},
		});

		// Collapse all others: Alt + L
		registerShortcut({
			name: 'blockera/list-view/collapse-all-others',
			category: 'blockera',
			description: __(
				'Collapse all other blocks in the list view.',
				'blockera'
			),
			keyCombination: {
				modifier: 'alt',
				character: 'l',
			},
		});
	}, [registerShortcut]);

	// Use keyboard shortcuts for actual functionality
	// Note: We use useKeyboardShortcut because it supports the exact key combination format
	// The shortcuts are registered above for display in the shortcuts modal
	useKeyboardShortcut(rawShortcut.primaryAlt(']'), handleExpandAll, {
		bindGlobal: true,
	});

	useKeyboardShortcut(rawShortcut.primaryAlt('['), handleCollapseAll, {
		bindGlobal: true,
	});

	// Early return if public API is not available (after all hooks)
	if (!ListView) {
		return null;
	}

	return (
		<div
			className="blockera-combined-sidebar__list-view"
			onKeyDown={closeListViewOnEscape as any}
			ref={sidebarRef}
		>
			<Tabs
				className="blockera-tabbed-sidebar"
				activeTab="list-view"
				design="modern"
				fitWidthTabs={false}
				tabs={[
					{
						name: 'list-view',
						title: _x('List View', 'Post overview', 'blockera'),
					},
					{
						name: 'outline',
						title: _x('Outline', 'Post overview', 'blockera'),
					},
				]}
				setCurrentTab={setTab}
				injectMenuEnd={
					tab === 'list-view' ? (
						<div className="blockera-list-view-controls">
							<Button
								variant="tertiary"
								size="small"
								onClick={handleCollapseAllOthers}
								icon={CollapseAllOthersIcon}
								label={
									__(
										'Collapse all others open items but keep current block expanded',
										'blockera'
									) +
									' ' +
									displayShortcut.alt('l')
								}
								disabled={!selectedBlockId}
							/>

							<Button
								variant="tertiary"
								size="small"
								onClick={handleCollapseAll}
								icon={CollapseAllIcon}
								label={
									__('Collapse all', 'blockera') +
									' ' +
									displayShortcut.primaryAlt('[')
								}
							/>

							<Button
								variant="tertiary"
								size="small"
								onClick={handleExpandAll}
								icon={ExpandAllIcon}
								label={
									__('Expand all', 'blockera') +
									' ' +
									displayShortcut.primaryAlt(']')
								}
							/>
						</div>
					) : undefined
				}
				getPanel={(selectedTab: any) => {
					if (selectedTab.name === 'list-view') {
						return (
							<div
								className="editor-list-view-sidebar__list-view-container"
								ref={listViewContainerRef}
							>
								<div
									className="editor-list-view-sidebar__list-view-panel-content"
									ref={listViewContentRef}
								>
									<ListView
										dropZoneElement={dropZoneElement}
									/>
								</div>
							</div>
						);
					}

					if (selectedTab.name === 'outline') {
						return (
							<div className="editor-list-view-sidebar__list-view-container">
								<ListViewOutline />
							</div>
						);
					}

					return null;
				}}
			/>
		</div>
	);
}
