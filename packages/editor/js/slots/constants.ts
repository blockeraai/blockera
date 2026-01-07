/**
 * Slot configurations array.
 * Each slot defines where it should be injected using selectors with fallback priority.
 */
import type { SlotConfig } from './types';

export const SLOTS_CONFIG: SlotConfig[] = [
	{
		id: 'blockera/slots/editor-header-settings',
		selectors: ['.editor-header__settings', '.edit-post-header__settings'],
		placement: 'before',
		placementSelector: '.editor-header__post-preview-button',
	},
	{
		id: 'blockera/slots/editor-header-toolbar',
		selectors: ['.editor-header .editor-header__toolbar'],
		placement: 'start',
	},
	{
		id: 'blockera/slots/editor-secondary-sidebar',
		selectors: ['.interface-interface-skeleton__body'],
		placement: 'before',
		placementSelector: '.interface-interface-skeleton__secondary-sidebar',
		className: 'interface-interface-skeleton__secondary-sidebar-blockera',
	},
	{
		id: 'blockera/slots/keyboard-shortcut-help-modal',
		selectors: [
			'.editor-keyboard-shortcut-help-modal__section.editor-keyboard-shortcut-help-modal__main-shortcuts',
		],
		placement: 'after',
		className: 'blockera-keyboard-shortcuts-extension',
		isActive: (select) => {
			const interfaceSelect = select('core/interface') as {
				isModalActive: (modalName: string) => boolean;
			};
			return interfaceSelect.isModalActive(
				'editor/keyboard-shortcut-help'
			);
		},
	},
];

/**
 * Get slot configuration by ID.
 *
 * @param slotId - The slot ID to find.
 * @return The slot configuration or undefined if not found.
 */
export function getSlotConfig(slotId: string): SlotConfig | undefined {
	return SLOTS_CONFIG.find((slot) => slot.id === slotId);
}

/**
 * Convert slot ID to CSS class name (replaces / with - and slots with elements).
 *
 * @param slotId - The slot ID to convert.
 * @return The CSS class name.
 * @example
 * 'blockera/slots/editor-header-settings' -> 'blockera-elements-editor-header-settings'
 */
export function slotIdToClassName(slotId: string): string {
	return slotId.replace(/\//g, '-').replace(/-slots-/g, '-elements-');
}
