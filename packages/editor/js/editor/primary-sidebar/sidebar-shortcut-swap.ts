/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as keyboardShortcutsStore } from '@wordpress/keyboard-shortcuts';

/**
 * Core defaults `core/editor/toggle-sidebar` to Cmd+Shift+, (comma). Blockera moves
 * the primary sidebar toggle to Cmd+Shift+. (period) so the secondary sidebar can use comma.
 *
 * The Site Editor registers shortcuts after Blockera's first run; subscribe to the
 * keyboard-shortcuts store and re-call this when core restores the default combo.
 */
export function applyBlockeraPrimarySidebarShortcutSwap(): void {
	const { unregisterShortcut, registerShortcut } = dispatch(
		keyboardShortcutsStore
	);

	unregisterShortcut('core/editor/toggle-sidebar');
	registerShortcut({
		name: 'core/editor/toggle-sidebar',
		category: 'core',
		description: __(
			'Show or hide the primary sidebar (right side).',
			'blockera'
		),
		keyCombination: {
			modifier: 'primaryShift',
			character: '.',
		},
	});
	registerShortcut({
		name: 'blockera/sidebars/toggle-sidebar',
		category: 'blockera',
		description: __(
			'Show or hide the primary sidebar (right side).',
			'blockera'
		),
		keyCombination: {
			modifier: 'primaryShift',
			character: '.',
		},
		icon: 'arrow-right',
	});
}

/**
 * True when core's binding is still the default (comma), including right after core re-registers it.
 */
export function isCoreToggleSidebarDefaultCombo(): boolean {
	const combo = (
		select(keyboardShortcutsStore) as {
			getShortcutKeyCombination: (
				name: string
			) => { modifier?: string; character?: string } | undefined;
		}
	).getShortcutKeyCombination('core/editor/toggle-sidebar');

	return combo?.modifier === 'primaryShift' && combo?.character === ',';
}
