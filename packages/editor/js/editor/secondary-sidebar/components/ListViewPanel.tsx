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
import { __, _x, sprintf, _n } from '@wordpress/i18n';
import {
	useShortcut,
	store as keyboardShortcutsStore,
} from '@wordpress/keyboard-shortcuts';
import { Button } from '@wordpress/components';
import {
	useCallback,
	useRef,
	useState,
	useEffect,
	useMemo,
	createInterpolateElement,
} from '@wordpress/element';
import { count as wordCount } from '@wordpress/wordcount';
import { create, getTextContent } from '@wordpress/rich-text';

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

/** Average reading rate (words per minute) for time-to-read estimate. */
const AVERAGE_READING_RATE = 189;

/**
 * Returns whether a heading block has no content.
 */
function isEmptyHeading(block: { attributes?: { content?: string } }): boolean {
	const content = block?.attributes?.content;
	return !content || String(content).trim().length === 0;
}

/**
 * Builds outline items from blocks: only core/heading, with level and isEmpty.
 */
function computeOutlineHeadings(
	blocks: Array<{
		name: string;
		clientId: string;
		attributes?: { level?: number; content?: string };
	}>
) {
	const out: Array<{
		clientId: string;
		level: number;
		isEmpty: boolean;
		attributes?: { content?: string };
		name: string;
	}> = [];
	for (let i = 0; i < blocks.length; i++) {
		const block = blocks[i];
		if (block?.name !== 'core/heading') {
			continue;
		}
		out.push({
			clientId: block.clientId,
			name: block.name,
			level: block.attributes?.level ?? 1,
			isEmpty: isEmptyHeading(block),
			attributes: block.attributes,
		});
	}
	return out;
}

/**
 * List view outline: document statistics (characters, words, time to read) and
 * document outline (headings from core/heading blocks). Mirrors Gutenberg
 * list-view-sidebar/list-view-outline.js and document-outline behavior.
 */
function ListViewOutline() {
	const { selectBlock } = useDispatch(blockEditorStore);

	const content = useSelect(
		(select) =>
			(
				select(editorStore) as {
					getEditedPostAttribute: (key: string) => string;
				}
			).getEditedPostAttribute?.('content') ?? '',
		[]
	);

	const blocks = useSelect((select) => {
		const blockSelect = select(blockEditorStore) as {
			getClientIdsWithDescendants?: () => string[];
			getBlock?: (id: string) => {
				name: string;
				clientId: string;
				attributes?: { level?: number; content?: string };
				innerBlocks?: unknown[];
			} | null;
			getBlocks?: (rootClientId: string | null) => Array<{
				name: string;
				clientId: string;
				attributes?: { level?: number; content?: string };
				innerBlocks?: unknown[];
			}>;
		};
		const getClientIdsWithDescendants =
			blockSelect.getClientIdsWithDescendants;
		const getBlock = blockSelect.getBlock;
		const getBlocks = blockSelect.getBlocks;
		if (!getBlock) {
			return [];
		}
		let clientIds = getClientIdsWithDescendants?.() ?? [];
		if (clientIds.length === 0 && getBlocks) {
			const collectIds = (rootId: string | null): string[] => {
				const list = getBlocks(rootId) ?? [];
				const ids: string[] = [];
				for (let i = 0; i < list.length; i++) {
					const b = list[i];
					ids.push(b.clientId);
					ids.push(...collectIds(b.clientId));
				}
				return ids;
			};
			clientIds = collectIds(null);
		}
		const result: Array<{
			name: string;
			clientId: string;
			attributes?: { level?: number; content?: string };
		}> = [];
		for (let i = 0; i < clientIds.length; i++) {
			const b = getBlock(clientIds[i]);
			if (b) {
				result.push(b);
			}
		}
		return result;
	}, []);

	const headings = useMemo(() => computeOutlineHeadings(blocks), [blocks]);

	const characterCount = useMemo(
		() =>
			typeof wordCount === 'function'
				? wordCount(content, 'characters_including_spaces')
				: 0,
		[content]
	);
	const words = useMemo(
		() =>
			typeof wordCount === 'function' ? wordCount(content, 'words') : 0,
		[content]
	);
	const minutesToRead = Math.max(
		0,
		Math.round(Number(words) / AVERAGE_READING_RATE)
	);
	const minutesToReadLabel =
		minutesToRead === 0
			? createInterpolateElement(__('< 1 minute', 'blockera'), {
					span: <span />,
				})
			: createInterpolateElement(
					sprintf(
						/* translators: %s: the number of minutes to read the post. */
						_n(
							'%s minute',
							'%s minutes',
							minutesToRead,
							'blockera'
						),
						minutesToRead
					),
					{ span: <span /> }
				);

	const prevLevelRef = useRef(1);
	const countByLevel = useMemo(() => {
		const acc: Record<number, number> = {};
		for (let i = 0; i < headings.length; i++) {
			const level = headings[i].level;
			acc[level] = (acc[level] || 0) + 1;
		}
		return acc;
	}, [headings]);
	const hasMultipleH1 = (countByLevel[1] ?? 0) > 1;

	if (headings.length >= 1) {
		prevLevelRef.current = 1;
	}

	return (
		<div className="editor-list-view-sidebar__outline">
			<div className="editor-list-view-sidebar__outline-info">
				<div className="editor-list-view-sidebar__outline-info-row">
					<span>{__('Characters:', 'blockera')}</span>
					<span>{characterCount}</span>
				</div>
				<div className="editor-list-view-sidebar__outline-info-row">
					<span>{__('Words:', 'blockera')}</span>
					<span>{words}</span>
				</div>
				<div className="editor-list-view-sidebar__outline-info-row">
					<span>{__('Time to read:', 'blockera')}</span>
					<span>{minutesToReadLabel}</span>
				</div>
			</div>

			<div className="editor-list-view-sidebar__outline-headings">
				{headings.length < 1 ? (
					<>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '16px',
								flexDirection: 'column',
								textAlign: 'center',
								justifyContent: 'center',
								color: '#757575',
							}}
						>
							<svg
								width="138"
								height="148"
								viewBox="0 0 138 148"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
								focusable="false"
							>
								<rect
									width="138"
									height="148"
									rx="4"
									fill="#F0F6FC"
								></rect>
								<line
									x1="44"
									y1="28"
									x2="24"
									y2="28"
									stroke="#DDDDDD"
								></line>
								<rect
									x="48"
									y="16"
									width="27"
									height="23"
									rx="4"
									fill="#DDDDDD"
								></rect>
								<path
									d="M54.7585 32V23.2727H56.6037V26.8736H60.3494V23.2727H62.1903V32H60.3494V28.3949H56.6037V32H54.7585ZM67.4574 23.2727V32H65.6122V25.0241H65.5611L63.5625 26.277V24.6406L65.723 23.2727H67.4574Z"
									fill="black"
								></path>
								<line
									x1="55"
									y1="59"
									x2="24"
									y2="59"
									stroke="#DDDDDD"
								></line>
								<rect
									x="59"
									y="47"
									width="29"
									height="23"
									rx="4"
									fill="#DDDDDD"
								></rect>
								<path
									d="M65.7585 63V54.2727H67.6037V57.8736H71.3494V54.2727H73.1903V63H71.3494V59.3949H67.6037V63H65.7585ZM74.6605 63V61.6705L77.767 58.794C78.0313 58.5384 78.2528 58.3082 78.4318 58.1037C78.6136 57.8991 78.7514 57.6989 78.8452 57.5028C78.9389 57.304 78.9858 57.0895 78.9858 56.8594C78.9858 56.6037 78.9276 56.3835 78.8111 56.1989C78.6946 56.0114 78.5355 55.8679 78.3338 55.7685C78.1321 55.6662 77.9034 55.6151 77.6477 55.6151C77.3807 55.6151 77.1477 55.669 76.9489 55.777C76.75 55.8849 76.5966 56.0398 76.4886 56.2415C76.3807 56.4432 76.3267 56.6832 76.3267 56.9616H74.5753C74.5753 56.3906 74.7045 55.8949 74.9631 55.4744C75.2216 55.054 75.5838 54.7287 76.0497 54.4986C76.5156 54.2685 77.0526 54.1534 77.6605 54.1534C78.2855 54.1534 78.8295 54.2642 79.2926 54.4858C79.7585 54.7045 80.1207 55.0085 80.3793 55.3977C80.6378 55.7869 80.767 56.233 80.767 56.7358C80.767 57.0653 80.7017 57.3906 80.571 57.7116C80.4432 58.0327 80.2145 58.3892 79.8849 58.7812C79.5554 59.1705 79.0909 59.6378 78.4915 60.1832L77.2173 61.4318V61.4915H80.8821V63H74.6605Z"
									fill="black"
								></path>
								<line
									x1="80"
									y1="90"
									x2="24"
									y2="90"
									stroke="#DDDDDD"
								></line>
								<rect
									x="84"
									y="78"
									width="30"
									height="23"
									rx="4"
									fill="#F0B849"
								></rect>
								<path
									d="M90.7585 94V85.2727H92.6037V88.8736H96.3494V85.2727H98.1903V94H96.3494V90.3949H92.6037V94H90.7585ZM99.5284 92.4659V91.0128L103.172 85.2727H104.425V87.2841H103.683L101.386 90.919V90.9872H106.564V92.4659H99.5284ZM103.717 94V92.0227L103.751 91.3793V85.2727H105.482V94H103.717Z"
									fill="black"
								></path>
								<line
									x1="66"
									y1="121"
									x2="24"
									y2="121"
									stroke="#DDDDDD"
								></line>
								<rect
									x="70"
									y="109"
									width="29"
									height="23"
									rx="4"
									fill="#DDDDDD"
								></rect>
								<path
									d="M76.7585 125V116.273H78.6037V119.874H82.3494V116.273H84.1903V125H82.3494V121.395H78.6037V125H76.7585ZM88.8864 125.119C88.25 125.119 87.6832 125.01 87.1861 124.791C86.6918 124.57 86.3011 124.266 86.0142 123.879C85.7301 123.49 85.5838 123.041 85.5753 122.533H87.4332C87.4446 122.746 87.5142 122.933 87.642 123.095C87.7727 123.254 87.946 123.378 88.1619 123.466C88.3778 123.554 88.6207 123.598 88.8906 123.598C89.1719 123.598 89.4205 123.548 89.6364 123.449C89.8523 123.349 90.0213 123.212 90.1435 123.036C90.2656 122.859 90.3267 122.656 90.3267 122.426C90.3267 122.193 90.2614 121.987 90.1307 121.808C90.0028 121.626 89.8182 121.484 89.5767 121.382C89.3381 121.28 89.054 121.229 88.7244 121.229H87.9105V119.874H88.7244C89.0028 119.874 89.2486 119.825 89.4616 119.729C89.6776 119.632 89.8452 119.499 89.9645 119.328C90.0838 119.155 90.1435 118.953 90.1435 118.723C90.1435 118.504 90.0909 118.312 89.9858 118.148C89.8835 117.98 89.7386 117.849 89.5511 117.756C89.3665 117.662 89.1506 117.615 88.9034 117.615C88.6534 117.615 88.4247 117.661 88.2173 117.751C88.0099 117.839 87.8438 117.966 87.7188 118.131C87.5938 118.295 87.527 118.489 87.5185 118.71H85.75C85.7585 118.207 85.902 117.764 86.1804 117.381C86.4588 116.997 86.8338 116.697 87.3054 116.482C87.7798 116.263 88.3153 116.153 88.9119 116.153C89.5142 116.153 90.0412 116.263 90.4929 116.482C90.9446 116.7 91.2955 116.996 91.5455 117.368C91.7983 117.737 91.9233 118.152 91.9205 118.612C91.9233 119.101 91.7713 119.509 91.4645 119.835C91.1605 120.162 90.7642 120.369 90.2756 120.457V120.526C90.9176 120.608 91.4063 120.831 91.7415 121.195C92.0795 121.555 92.2472 122.007 92.2443 122.55C92.2472 123.047 92.1037 123.489 91.8139 123.875C91.527 124.261 91.1307 124.565 90.625 124.787C90.1193 125.009 89.5398 125.119 88.8864 125.119Z"
									fill="black"
								></path>
							</svg>

							<p className="editor-list-view-sidebar__outline-empty">
								{__(
									'Navigate the structure of your document and address issues like empty or incorrect heading levels.',
									'blockera'
								)}
							</p>
						</div>
					</>
				) : (
					<ul className="editor-list-view-sidebar__outline-list">
						{headings.map((item) => {
							const prevLevel = prevLevelRef.current;
							const isIncorrectLevel = item.level > prevLevel + 1;
							prevLevelRef.current = item.level;
							const isValid =
								!item.isEmpty &&
								!isIncorrectLevel &&
								!!item.level &&
								(item.level !== 1 || !hasMultipleH1);
							const displayContent = item.isEmpty
								? __('(Empty heading)', 'blockera')
								: getTextContent(
										create({
											html:
												item.attributes?.content ?? '',
										})
									);
							const headingLevelClass = `is-h${Math.min(
								6,
								Math.max(1, item.level)
							)}`;

							return (
								<li
									key={item.clientId}
									className={`editor-list-view-sidebar__outline-item document-outline__item ${headingLevelClass} ${!isValid ? 'is-invalid' : ''}`}
								>
									<button
										type="button"
										className="editor-list-view-sidebar__outline-item-button"
										onClick={() => {
											selectBlock(item.clientId);
										}}
									>
										{item.level !== 1 && (
											<span
												className="document-outline__emdash"
												aria-hidden="true"
											/>
										)}

										<span className="editor-list-view-sidebar__outline-item-level">
											H{item.level}
										</span>

										<span>{displayContent}</span>
									</button>

									{isIncorrectLevel && (
										<span className="editor-list-view-sidebar__outline-warning">
											{__(
												'(Incorrect heading level)',
												'blockera'
											)}
										</span>
									)}

									{item.level === 1 && hasMultipleH1 && (
										<span className="editor-list-view-sidebar__outline-warning">
											{__(
												'(Multiple H1 headings are not recommended)',
												'blockera'
											)}
										</span>
									)}
								</li>
							);
						})}
					</ul>
				)}
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
