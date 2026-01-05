/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { store as blockeraEditorStore } from '../../store-persistence';
import { ResizeHandle } from '../../shared/ResizeHandle';
import InserterLibraryPanel from './InserterLibraryPanel';
import ListViewPanel from './ListViewPanel';

/**
 * Secondary sidebar component that displays both inserter (top) and list view (bottom).
 */
export default function SecondarySidebar() {
	// Get list view height from store
	const listViewHeight = useSelect((select) => {
		const storeSelect = select(blockeraEditorStore) as any;
		return storeSelect.getListViewHeight();
	}, []);

	// Get sidebar visibility state from store
	const isSidebarVisible = useSelect((select) => {
		const storeSelect = select(blockeraEditorStore) as any;
		return storeSelect.isSecondarySidebarVisible();
	}, []);

	// Get dispatch function for updating list view height
	const { setListViewHeight } = useDispatch(blockeraEditorStore) as {
		setListViewHeight: (height: string) => void;
	};

	// Update CSS variable on container whenever height changes
	useEffect(() => {
		if (!listViewHeight) {
			return;
		}

		// Find the combined sidebar container
		const container = document.querySelector(
			'.blockera-combined-sidebar'
		) as HTMLElement | null;
		if (container) {
			container.style.setProperty('--list-view-height', listViewHeight);
		}
	}, [listViewHeight]);

	// Handle resize callback - updates store height
	const handleResize = (height: string) => {
		setListViewHeight(height);
	};

	return (
		<div className="blockera-combined-sidebar">
			<InserterLibraryPanel />

			{/* Resize handle - only show when sidebar is visible */}
			{isSidebarVisible && (
				<ResizeHandle
					side="top"
					isVisible={isSidebarVisible}
					minWidth={20}
					maxWidth={80}
					onResize={handleResize}
				/>
			)}

			<ListViewPanel />
		</div>
	);
}
