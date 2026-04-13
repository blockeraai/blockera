/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { store as keyboardShortcutsStore } from '@wordpress/keyboard-shortcuts';
import { Fill } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Shortcut from './Shortcut';

/**
 * Props for DynamicShortcut component.
 */
export interface DynamicShortcutProps {
	/** The name of the shortcut to display. */
	name: string;
	/** Optional slot ID to render into using Fill. If not provided, renders directly. */
	slotId?: string;
}

/**
 * Component that dynamically renders a shortcut by its registered name.
 * Fetches shortcut data from the keyboard shortcuts store.
 * Can render directly or into a slot using Fill.
 */
function DynamicShortcut({ name, slotId }: DynamicShortcutProps) {
	const { keyCombination, description, aliases } = useSelect(
		(select) => {
			const storeSelect = select(keyboardShortcutsStore) as {
				getShortcutKeyCombination: (
					name: string
				) => { modifier?: string; character: string } | null;
				getShortcutDescription: (name: string) => string | undefined;
				getShortcutAliases: (
					name: string
				) => Array<{ modifier?: string; character: string }>;
			};

			const combo = storeSelect.getShortcutKeyCombination(name);
			const aliasList = storeSelect.getShortcutAliases(name);
			const desc = storeSelect.getShortcutDescription(name);

			return {
				keyCombination: combo,
				aliases: aliasList,
				description: desc,
			};
		},
		[name]
	);

	if (!keyCombination || !keyCombination.character) {
		return null;
	}

	const shortcutContent = (
		<Shortcut
			keyCombination={keyCombination}
			description={description}
			aliases={aliases}
		/>
	);

	// If slotId is provided, render using Fill; otherwise render directly
	if (slotId) {
		return <Fill name={slotId}>{shortcutContent}</Fill>;
	}

	return shortcutContent;
}

export default DynamicShortcut;
