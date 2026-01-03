/**
 * Hook for handling zoom keyboard shortcuts.
 * Registers shortcuts with WordPress Block Editor API and handles zoom actions.
 * Shortcuts appear in the keyboard shortcuts help modal.
 */

import { useEffect, useRef } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { useShortcut } from '@wordpress/keyboard-shortcuts';
import { __ } from '@wordpress/i18n';
import {
	store as keyboardShortcutsStore,
} from '@wordpress/keyboard-shortcuts';
import { ZOOM_STEP, DEFAULT_ZOOM } from '../utils/constants';
import type { UseZoomKeyboardOptions } from '../types';

/**
 * Hook to handle zoom keyboard shortcuts.
 * Registers shortcuts with WordPress Block Editor API and binds handlers.
 * Shortcuts:
 * - Cmd/Ctrl + Plus: Zoom in (+10%)
 * - Cmd/Ctrl + Minus: Zoom out (-10%)
 * - Cmd/Ctrl + 0: Reset to 100%
 *
 * @param options - Hook options.
 */
export function useZoomKeyboard({
	zoomPercent,
	onZoomChange,
	onZoomToFit,
	enabled = true,
}: UseZoomKeyboardOptions): void {
	const { registerShortcut } = useDispatch(keyboardShortcutsStore);

	// Keep refs in sync with values for use in callbacks
	const zoomPercentRef = useRef(zoomPercent);
	const onZoomChangeRef = useRef(onZoomChange);
	const onZoomToFitRef = useRef(onZoomToFit);

	useEffect(() => {
		zoomPercentRef.current = zoomPercent;
	}, [zoomPercent]);

	useEffect(() => {
		onZoomChangeRef.current = onZoomChange;
	}, [onZoomChange]);

	useEffect(() => {
		onZoomToFitRef.current = onZoomToFit;
	}, [onZoomToFit]);

	// Register keyboard shortcuts for display in shortcuts modal
	// Note: We use direct event listeners for actual handling since WordPress API
	// doesn't reliably handle '+' character
	useEffect(() => {
		if (!enabled) {
			return;
		}

		// Register shortcuts for display purposes only
		// The actual handling is done via direct event listeners below
		registerShortcut({
			name: 'blockera/zoom/zoom-in',
			category: 'blockera',
			description: __('Zoom in.', 'blockera-tabs'),
			keyCombination: {
				modifier: 'primary',
				character: '=',
			},
		});

		registerShortcut({
			name: 'blockera/zoom/zoom-out',
			category: 'blockera',
			description: __('Zoom out.', 'blockera-tabs'),
			keyCombination: {
				modifier: 'primary',
				character: '-',
			},
		});

		registerShortcut({
			name: 'blockera/zoom/reset',
			category: 'blockera',
			description: __('Reset zoom to 100%.', 'blockera-tabs'),
			keyCombination: {
				modifier: 'primary',
				character: '0',
			},
		});

		registerShortcut({
			name: 'blockera/zoom/zoom-to-fit',
			category: 'blockera',
			description: __('Zoom to fit.', 'blockera-tabs'),
			keyCombination: {
				modifier: 'shift',
				character: '1',
			},
		});
	}, [enabled, registerShortcut]);

	// Fallback: Direct keyboard event listener for Cmd/Ctrl + Plus
	// WordPress shortcuts API may not handle '+' character directly,
	// so we add a fallback that works like browser zoom
	// Use capture phase to ensure we catch the event before WordPress shortcuts
	useEffect(() => {
		if (!enabled) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent): void => {
			// Ignore if user is typing in an input field
			const target = event.target;
			if (
				target instanceof HTMLInputElement ||
				target instanceof HTMLTextAreaElement ||
				(target instanceof HTMLElement && target.isContentEditable)
			) {
				return;
			}

			// Check for modifier keys
			const isMod = event.metaKey || event.ctrlKey;
			const isShift = event.shiftKey;
			const isAlt = event.altKey;

			// Check for zoom to fit: Shift + 1 (without Cmd/Ctrl/Alt)
			// Handle this before checking for other modifier keys
			// Check both key and code to handle different keyboard layouts
			const isOne = event.key === '1' ||
				event.key === 'Digit1' ||
				event.code === 'Digit1' ||
				event.code === 'Numpad1';

			// Shift+1 should work without Cmd/Ctrl/Alt
			if (isShift && isOne && !isMod && !isAlt) {
				event.preventDefault();
				event.stopPropagation();
				if (onZoomToFitRef.current) {
					onZoomToFitRef.current();
				}
				return;
			}

			// For other shortcuts, require modifier key
			if (!isMod) {
				return;
			}

			// Check for zoom in: +
			// When pressing Cmd/Ctrl + Shift + =, browsers may produce '+' directly OR '=' with shiftKey
			// However, shiftKey may not be reported correctly when combined with Cmd/Ctrl
			// So we detect Cmd/Ctrl + = as zoom-in (browsers treat this as zoom like Cmd/Ctrl + Shift + =)
			// When pressing Cmd/Ctrl + Numpad +, event.key is '+' or event.code is 'NumpadAdd'
			const isPlus =
				event.key === '+' ||
				(event.key === '=' && isMod) || // Cmd/Ctrl + = should zoom in (like browser zoom)
				(event.key === '=' && event.shiftKey) ||
				event.code === 'NumpadAdd' ||
				(event.code === 'Equal' && isMod); // Cmd/Ctrl + Equal key should zoom in

			// Check for zoom out: -
			const isMinus =
				event.key === '-' ||
				event.code === 'Minus' ||
				event.code === 'NumpadSubtract';

			// Check for reset: 0
			const isZero = event.key === '0' || event.key === 'Digit0';

			if (isPlus) {
				event.preventDefault();
				event.stopPropagation();
				onZoomChangeRef.current(zoomPercentRef.current + ZOOM_STEP);
			} else if (isMinus) {
				event.preventDefault();
				event.stopPropagation();
				onZoomChangeRef.current(zoomPercentRef.current - ZOOM_STEP);
			} else if (isZero) {
				event.preventDefault();
				event.stopPropagation();
				onZoomChangeRef.current(DEFAULT_ZOOM);
			}
		};

		// Use capture phase to catch events before WordPress shortcuts API
		window.addEventListener('keydown', handleKeyDown, true);

		return () => {
			window.removeEventListener('keydown', handleKeyDown, true);
		};
	}, [enabled]);

	// Register shortcut handler for Shift+1 using WordPress shortcuts API
	// Note: WordPress shortcuts API may not handle Shift-only modifiers well,
	// so we rely on the direct event listener above for actual handling
	// This registration is mainly for display in the shortcuts help modal
	useShortcut('blockera/zoom/zoom-to-fit', (event) => {
		event.preventDefault();
		if (onZoomToFitRef.current) {
			onZoomToFitRef.current();
		}
	}, { bindGlobal: true });
}
