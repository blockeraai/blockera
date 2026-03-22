/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';
import { store as interfaceStore } from '@wordpress/interface';

/**
 * Internal dependencies
 */
import { store as blockeraEditorStore } from '../store-persistence';

/**
 * Applies Blockera sidebar intent to the editor shell (WP interface).
 * Kept here as the only bridge to `interface`; decision logic uses Blockera selectors only.
 */
function applyPrimarySidebarToEditorShell(open: boolean): void {
	const { enableComplementaryArea, disableComplementaryArea } = dispatch(
		interfaceStore
	) as {
		enableComplementaryArea: (scope: string, id: string) => void;
		disableComplementaryArea: (scope: string) => void;
	};

	if (open) {
		enableComplementaryArea('core', 'edit-post/document');
	} else {
		disableComplementaryArea('core');
	}
}

/**
 * "Toggle both" shortcut behavior (Blockera-only reads):
 * - If both sidebars are closed → open both.
 * - If either or both are open → close both.
 */
export function toggleBothSidebars(): void {
	const store = blockeraEditorStore;
	const storeSelect = select(store) as {
		areBothSidebarsClosed: () => boolean;
	};
	const storeDispatch = dispatch(store) as {
		setSecondarySidebarVisible: (visible: boolean) => void;
	};

	if (storeSelect.areBothSidebarsClosed()) {
		storeDispatch.setSecondarySidebarVisible(true);
		applyPrimarySidebarToEditorShell(true);
	} else {
		storeDispatch.setSecondarySidebarVisible(false);
		applyPrimarySidebarToEditorShell(false);
	}
	// `primarySidebarOpen` is updated from the real complementary area in PrimarySidebarController.
}
