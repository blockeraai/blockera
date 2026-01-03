/**
 * WordPress dependencies
 */
import { useEffect, useRef, useCallback, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as commandsStore } from '@wordpress/commands';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	getIsCommandBarMode,
	setCommandBarMode,
	subscribeToCommandBarMode,
} from '../utils/commandBarMode';
import { isEditorPage } from '../../utils/isEditorPage';
import { TAB_COMMAND_MARKER } from '../utils/wrapCommandLoaderHook';

// CSS class added to body when in add tab mode
const ADD_TAB_MODE_CLASS = 'blockera-tabs-add-tab-mode';

/**
 * Placeholder to show in the command palette input when it was opened by the tab bar "+".
 *
 * Gutenberg's command palette currently hardcodes its default placeholder internally, so
 * we override it in a tightly scoped way only for "add tab mode".
 */
const ADD_TAB_MODE_PLACEHOLDER = __('Search for posts, pages, templates...');

/**
 * Exception command patterns that should be visible in add tab mode
 * Matching is case-insensitive and uses "contains" logic
 */
const EXCEPTION_COMMAND_PATTERNS: readonly string[] = [
	'back', // Back navigation commands
	'new post', // Create post commands
	'new page', // Create page commands
] as const;

/**
 * Check if a command value matches any exception pattern
 *
 * @param value - The data-value attribute of the command item
 * @returns True if the command should be shown as exception
 */
function isExceptionCommand(value: string | null): boolean {
	if (!value) {
		return false;
	}

	const lowerValue = value.toLowerCase();

	return EXCEPTION_COMMAND_PATTERNS.some((pattern) => {
		const lowerPattern = pattern.toLowerCase();
		// Check if value contains the pattern
		return lowerValue.includes(lowerPattern);
	});
}

/**
 * Check if a command should be visible in add tab mode
 *
 * @param value - The data-value attribute of the command item
 * @returns True if the command should be visible
 */
function shouldShowInAddTabMode(value: string | null): boolean {
	if (!value) {
		return false;
	}

	// Show navigation commands (our wrapped commands with ⌘TAB marker)
	if (value.endsWith(TAB_COMMAND_MARKER)) {
		return true;
	}

	// Show exception commands
	if (isExceptionCommand(value)) {
		return true;
	}

	return false;
}

/**
 * Mark command items as visible/hidden for CSS
 * Uses CSS to hide, keyboard interception to skip focus
 */
function markCommandItems(): void {
	const commandItems = document.querySelectorAll(
		'.commands-command-menu [cmdk-item]'
	);

	commandItems.forEach((item) => {
		const value = item.getAttribute('data-value');

		if (shouldShowInAddTabMode(value)) {
			item.setAttribute('data-blockera-visible', 'true');
			item.removeAttribute('data-blockera-hidden');
		} else {
			item.setAttribute('data-blockera-hidden', 'true');
			item.removeAttribute('data-blockera-visible');
		}
	});
}

/**
 * Clear all marking attributes
 */
function clearCommandItemMarks(): void {
	const commandItems = document.querySelectorAll(
		'.commands-command-menu [cmdk-item]'
	);
	commandItems.forEach((item) => {
		item.removeAttribute('data-blockera-visible');
		item.removeAttribute('data-blockera-hidden');
	});
}

/**
 * Get all visible command items
 */
function getVisibleItems(): Element[] {
	return Array.from(
		document.querySelectorAll(
			'.commands-command-menu [cmdk-item][data-blockera-visible="true"]'
		)
	);
}

/**
 * Find the next/previous visible item from current selection
 *
 * @param direction - Navigation direction ('up' or 'down')
 * @returns The next visible item or null
 */
function findNextVisibleItem(direction: 'up' | 'down'): Element | null {
	const visibleItems = getVisibleItems();
	if (visibleItems.length === 0) {
		return null;
	}

	// Find currently selected item
	const selectedItem = document.querySelector(
		'.commands-command-menu [cmdk-item][aria-selected="true"]'
	);

	if (!selectedItem) {
		return visibleItems[0] ?? null;
	}

	const currentIndex = visibleItems.indexOf(selectedItem);

	if (currentIndex === -1) {
		// Current selection is hidden, go to first visible
		return visibleItems[0] ?? null;
	}

	if (direction === 'down') {
		return visibleItems[(currentIndex + 1) % visibleItems.length] ?? null;
	}
	// direction === 'up'
	return (
		visibleItems[(currentIndex - 1 + visibleItems.length) % visibleItems.length] ??
		null
	);
}

/**
 * Set visual selection on an item without triggering its action
 *
 * @param item - The DOM element to select
 */
function setItemSelected(item: Element): void {
	// Remove selection from all items
	const allItems = document.querySelectorAll(
		'.commands-command-menu [cmdk-item][aria-selected="true"]'
	);
	allItems.forEach((el) => {
		el.setAttribute('aria-selected', 'false');
	});

	// Set selection on target item
	item.setAttribute('aria-selected', 'true');

	// Scroll item into view if needed
	item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/**
 * Handle keyboard navigation to skip hidden items
 *
 * @param event - The keyboard event
 */
function handleKeyboardNav(event: KeyboardEvent): void {
	if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
		return;
	}

	const direction = event.key === 'ArrowDown' ? 'down' : 'up';
	const nextItem = findNextVisibleItem(direction);

	if (nextItem) {
		// Prevent default cmdk navigation
		event.preventDefault();
		event.stopPropagation();

		// Set visual selection without triggering action
		setItemSelected(nextItem);
	}
}

/**
 * Return type for useAddTabCommandBar hook.
 */
export interface UseAddTabCommandBarReturn {
	/** Function to open the command bar in add tab mode. */
	openAddTabCommandBar: () => void;
	/** Whether currently in add tab mode. */
	isInAddTabMode: boolean;
}

/**
 * Hook to manage the command bar in "add tab mode"
 *
 * When entering add tab mode:
 * 1. Adds a CSS class to body to filter non-navigation commands via CSS
 * 2. Opens the command bar
 * 3. Uses MutationObserver to mark commands as they render
 * 4. When command bar closes, removes the class and exits mode
 *
 * @returns Object with openAddTabCommandBar function
 */
export function useAddTabCommandBar(): UseAddTabCommandBarReturn {
	const { open } = useDispatch(commandsStore) as { open: () => void };
	const isOpen = useSelect(
		(select) => (select(commandsStore) as { isOpen: () => boolean }).isOpen(),
		[]
	);
	const [isInAddTabMode, setIsInAddTabMode] = useState(getIsCommandBarMode());

	// Refs for cleanup
	const observerRef = useRef<MutationObserver | null>(null);
	const commandMenuRef = useRef<Element | null>(null);
	const wasOpenRef = useRef(isOpen);
	const originalPlaceholderRef = useRef<string | null>(null);

	/**
	 * Override the command palette input placeholder while we're in add tab mode.
	 *
	 * Note: This is a DOM-level override because Gutenberg doesn't currently expose a
	 * public option to customize the command palette placeholder via the commands store.
	 */
	const ensureAddTabModePlaceholder = useCallback((): void => {
		const input = document.querySelector<HTMLInputElement>(
			'.commands-command-menu [cmdk-input]'
		);
		if (!input) {
			return;
		}

		// Capture the original placeholder only once per open session.
		if (originalPlaceholderRef.current === null) {
			originalPlaceholderRef.current = input.getAttribute('placeholder');
		}

		if (input.getAttribute('placeholder') !== ADD_TAB_MODE_PLACEHOLDER) {
			input.setAttribute('placeholder', ADD_TAB_MODE_PLACEHOLDER);
		}
	}, []);

	const restoreOriginalPlaceholder = useCallback((): void => {
		if (originalPlaceholderRef.current === null) {
			return;
		}

		const input = document.querySelector<HTMLInputElement>(
			'.commands-command-menu [cmdk-input]'
		);
		if (!input) {
			return;
		}

		// Restore to whatever Gutenberg originally rendered (localized).
		if (originalPlaceholderRef.current) {
			input.setAttribute('placeholder', originalPlaceholderRef.current);
		} else {
			input.removeAttribute('placeholder');
		}

		originalPlaceholderRef.current = null;
	}, []);

	// Subscribe to add tab mode changes
	useEffect(() => {
		return subscribeToCommandBarMode(setIsInAddTabMode);
	}, []);

	// Manage body class based on add tab mode
	useEffect(() => {
		document.body.classList.toggle(ADD_TAB_MODE_CLASS, isInAddTabMode);
		return () => {
			document.body.classList.remove(ADD_TAB_MODE_CLASS);
		};
	}, [isInAddTabMode]);

	// Mark and filter command items when in add tab mode and command bar is open
	useEffect(() => {
		if (!isInAddTabMode || !isOpen) {
			// Cleanup
			observerRef.current?.disconnect();
			observerRef.current = null;
			commandMenuRef.current?.removeEventListener(
				'keydown',
				handleKeyboardNav as EventListener,
				true
			);
			commandMenuRef.current = null;
			clearCommandItemMarks();
			restoreOriginalPlaceholder();
			return;
		}

		// Setup function to initialize observer and keyboard handler
		const setup = (): void => {
			const commandMenu = document.querySelector('.commands-command-menu');
			if (!commandMenu) {
				// Retry if menu not yet rendered
				requestAnimationFrame(setup);
				return;
			}

			// Keep the placeholder synced while the menu is mounted.
			ensureAddTabModePlaceholder();

			// Setup keyboard handler
			if (!commandMenuRef.current) {
				commandMenuRef.current = commandMenu;
				commandMenu.addEventListener(
					'keydown',
					handleKeyboardNav as EventListener,
					true
				);
			}

			// Mark items immediately
			markCommandItems();

			// Setup MutationObserver to mark new items as they appear
			if (!observerRef.current) {
				observerRef.current = new MutationObserver(() => {
					markCommandItems();
					// Cmdk can re-render the input; ensure placeholder stays correct.
					ensureAddTabModePlaceholder();
				});
				observerRef.current.observe(commandMenu, {
					childList: true,
					subtree: true,
				});
			}
		};

		setup();

		return () => {
			observerRef.current?.disconnect();
			observerRef.current = null;
			commandMenuRef.current?.removeEventListener(
				'keydown',
				handleKeyboardNav as EventListener,
				true
			);
			commandMenuRef.current = null;
			clearCommandItemMarks();
			restoreOriginalPlaceholder();
		};
	}, [
		isInAddTabMode,
		isOpen,
		ensureAddTabModePlaceholder,
		restoreOriginalPlaceholder,
	]);

	// When command bar closes while in add tab mode, exit the mode
	useEffect(() => {
		if (wasOpenRef.current && !isOpen && isInAddTabMode) {
			setCommandBarMode(false);
		}
		wasOpenRef.current = isOpen;
	}, [isOpen, isInAddTabMode]);

	// Open command bar in add tab mode
	const openAddTabCommandBar = useCallback(() => {
		if (!isEditorPage()) {
			return;
		}
		setCommandBarMode(true);
		// Small delay for React to re-render
		requestAnimationFrame(() => open());
	}, [open]);

	return { openAddTabCommandBar, isInAddTabMode };
}

