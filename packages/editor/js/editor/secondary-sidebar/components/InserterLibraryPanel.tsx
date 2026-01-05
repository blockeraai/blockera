/**
 * WordPress dependencies
 */
import {
	__experimentalLibrary as InserterLibrary,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { useViewportMatch } from '@wordpress/compose';
import { useCallback, useRef } from '@wordpress/element';
import { store as preferencesStore } from '@wordpress/preferences';
import { ESCAPE } from '@wordpress/keycodes';
import { store as editorStore } from '@wordpress/editor';

/**
 * Internal dependencies
 */
import { store as blockeraEditorStore } from '../../store-persistence';

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

	const closeInserterSidebar = useCallback(() => {
		toggleSecondarySidebar();
		setIsInserterOpened?.(false);
		inserterSidebarToggleRef?.current?.focus();
	}, [inserterSidebarToggleRef, setIsInserterOpened, toggleSecondarySidebar]);

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

	return (
		<div
			className="blockera-combined-sidebar__inserter"
			onKeyDown={closeInserterOnEscape as any}
		>
			<div className="editor-inserter-sidebar__content">
				<InserterLibrary
					showMostUsedBlocks={showMostUsedBlocks}
					showInserterHelpPanel
					shouldFocusBlock={isMobileViewport}
					rootClientId={blockSectionRootClientId}
					onSelect={inserter.onSelect}
					__experimentalInitialTab={inserter.tab}
					__experimentalInitialCategory={inserter.category}
					__experimentalFilterValue={inserter.filterValue}
					ref={libraryRef}
					onClose={closeInserterSidebar}
				/>
			</div>
		</div>
	);
}
