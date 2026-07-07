/**
 * WordPress dependencies
 */
import {
	__experimentalLibrary as InserterLibrary,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { useViewportMatch } from '@wordpress/compose';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import { store as preferencesStore } from '@wordpress/preferences';
import { ESCAPE } from '@wordpress/keycodes';
import { store as editorStore } from '@wordpress/editor';

/**
 * Internal dependencies
 */
import { store as blockeraEditorStore } from '../../store-persistence';
import InserterCategoryPanelCloseButton from './InserterCategoryPanelCloseButton';

interface InserterRemountState {
	tab: string | undefined;
	filterValue: string;
	category: undefined;
}

/**
 * Inserter library panel component that displays the block inserter.
 */
export default function InserterLibraryPanel() {
	const isMobileViewport = useViewportMatch('medium', '<');

	const { toggleSecondarySidebar } = useDispatch(blockeraEditorStore);

	// Inserter sidebar logic
	const {
		blockSectionRootClientId,
		inserterSidebarToggleRef,
		inserter,
		showMostUsedBlocks,
	} = useSelect((select) => {
		const editorSelect = select(editorStore) as any;
		const blockEditorSelect = select(blockEditorStore) as any;
		const preferencesSelect = select(preferencesStore);

		const getInserterSidebarToggleRef = () => {
			return (
				editorSelect.getInserterSidebarToggleRef?.() || {
					current: null,
				}
			);
		};

		const getInserter = () => {
			return (
				editorSelect.getInserter?.() || {
					onSelect: () => {},
					tab: undefined,
					category: undefined,
					filterValue: undefined,
				}
			);
		};

		const getBlockRootClientId = () => {
			return blockEditorSelect.getBlockRootClientId?.() || null;
		};

		const isZoomOut = () => {
			return blockEditorSelect.isZoomOut?.() || false;
		};

		const getSectionRootClientId = () => {
			return blockEditorSelect.getSectionRootClientId?.() || null;
		};

		const getBlockSectionRootClientId = () => {
			if (isZoomOut()) {
				const sectionRootClientId = getSectionRootClientId();
				if (sectionRootClientId) {
					return sectionRootClientId;
				}
			}
			return getBlockRootClientId();
		};

		return {
			inserterSidebarToggleRef: getInserterSidebarToggleRef(),
			inserter: getInserter(),
			showMostUsedBlocks:
				(preferencesSelect as any).get('core', 'mostUsedBlocks') ||
				false,
			blockSectionRootClientId: getBlockSectionRootClientId(),
		};
	}, []);

	const { setIsInserterOpened } = useDispatch(editorStore) as any;
	const libraryRef = useRef<HTMLDivElement>(null);
	const [libraryKey, setLibraryKey] = useState(0);
	const [inserterRemountState, setInserterRemountState] =
		useState<InserterRemountState | null>(null);

	const closeInserterSidebar = useCallback(() => {
		toggleSecondarySidebar();
		setIsInserterOpened?.(false);
		inserterSidebarToggleRef?.current?.focus();
	}, [inserterSidebarToggleRef, setIsInserterOpened, toggleSecondarySidebar]);

	const closeCategoryPanel = useCallback(() => {
		const root = libraryRef.current;

		if (!root) {
			return;
		}

		const selectedTabButton = root.querySelector(
			'.block-editor-tabbed-sidebar__tab[aria-selected="true"]'
		);
		const activeTabId = selectedTabButton?.id?.split('-').pop();
		const searchInput = root.querySelector(
			'.block-editor-inserter__search input'
		) as HTMLInputElement | null;
		const filterValue = searchInput?.value ?? inserter.filterValue ?? '';

		setInserterRemountState({
			tab: activeTabId ?? inserter.tab,
			filterValue,
			category: undefined,
		});
		setLibraryKey((currentKey) => currentKey + 1);

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				const remountedRoot = libraryRef.current;
				const categoryTabList = remountedRoot?.querySelector(
					'.block-editor-inserter__category-tablist'
				);
				const firstCategoryTab =
					categoryTabList?.querySelector('button');

				if (firstCategoryTab instanceof HTMLElement) {
					firstCategoryTab.focus();
				}
			});
		});
	}, [inserter.filterValue, inserter.tab]);

	// Remount state is only needed for the initial render after close.
	useEffect(() => {
		if (inserterRemountState === null) {
			return;
		}

		const frameId = requestAnimationFrame(() => {
			setInserterRemountState(null);
		});

		return () => {
			cancelAnimationFrame(frameId);
		};
	}, [libraryKey, inserterRemountState]);

	const closeInserterOnEscape = useCallback(
		(event: KeyboardEvent) => {
			if (event.keyCode === ESCAPE && !event.defaultPrevented) {
				event.preventDefault();
				closeInserterSidebar();
			}
		},
		[closeInserterSidebar]
	);

	// Early return if public API is not available
	if (!InserterLibrary) {
		return null;
	}

	const initialTab = inserterRemountState?.tab ?? inserter.tab;
	const initialCategory =
		inserterRemountState !== null
			? inserterRemountState.category
			: inserter.category;
	const initialFilterValue =
		inserterRemountState?.filterValue ?? inserter.filterValue;

	return (
		<div
			className="blockera-combined-sidebar__inserter"
			onKeyDown={closeInserterOnEscape as any}
		>
			<div className="editor-inserter-sidebar__content">
				<InserterLibrary
					key={libraryKey}
					showMostUsedBlocks={showMostUsedBlocks}
					showInserterHelpPanel
					shouldFocusBlock={isMobileViewport}
					rootClientId={blockSectionRootClientId}
					onSelect={inserter.onSelect}
					__experimentalInitialTab={initialTab}
					__experimentalInitialCategory={initialCategory}
					__experimentalFilterValue={initialFilterValue}
					ref={libraryRef}
					onClose={closeInserterSidebar}
				/>
				<InserterCategoryPanelCloseButton
					containerRef={libraryRef}
					observerKey={libraryKey}
					onCloseCategoryPanel={closeCategoryPanel}
				/>
			</div>
		</div>
	);
}
