/**
 * Hook for handling zoom keyboard shortcuts.
 * Registers shortcuts with WordPress Block Editor API and handles zoom actions.
 * Shortcuts appear in the keyboard shortcuts help modal.
 */

/**
 * WordPress dependencies
 */
import { useEffect, useRef } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import {
	useShortcut,
	store as keyboardShortcutsStore,
} from '@wordpress/keyboard-shortcuts';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { handleZoomKeyboardEvent } from '../utils/zoomKeyboard';
import type { UseZoomKeyboardOptions } from '../types';

/**
 * Hook to handle zoom keyboard shortcuts.
 * Registers shortcuts with WordPress Block Editor API and binds handlers.
 * Shortcuts:
 * - Cmd/Ctrl + Plus: Zoom in (+10%)
 * - Cmd/Ctrl + Minus: Zoom out (-10%)
 * - Cmd/Ctrl + 0: Reset to 100%
 * - Cmd/Ctrl + Shift + 1: Zoom to fit
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
			description: __('Zoom in.', 'blockera'),
			keyCombination: {
				modifier: 'primary',
				character: '=',
			},
		});

		registerShortcut({
			name: 'blockera/zoom/zoom-out',
			category: 'blockera',
			description: __('Zoom out.', 'blockera'),
			keyCombination: {
				modifier: 'primary',
				character: '-',
			},
		});

		registerShortcut({
			name: 'blockera/zoom/reset',
			category: 'blockera',
			description: __('Reset zoom to 100%.', 'blockera'),
			keyCombination: {
				modifier: 'primary',
				character: '0',
			},
		});

		registerShortcut({
			name: 'blockera/zoom/zoom-to-fit',
			category: 'blockera',
			description: __('Zoom to fit.', 'blockera'),
			keyCombination: {
				modifier: 'primaryShift',
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
			handleZoomKeyboardEvent(event, {
				getZoomPercent: () => zoomPercentRef.current,
				onZoomChange: (next) => {
					onZoomChangeRef.current(next);
				},
				onZoomToFit: onZoomToFitRef.current
					? () => {
							onZoomToFitRef.current?.();
						}
					: undefined,
			});
		};

		// Use capture phase to catch events before WordPress shortcuts API
		window.addEventListener('keydown', handleKeyDown, true);

		return () => {
			window.removeEventListener('keydown', handleKeyDown, true);
		};
	}, [enabled]);

	// Register shortcut handler for Ctrl+Shift+1 using WordPress shortcuts API
	useShortcut(
		'blockera/zoom/zoom-to-fit',
		(event) => {
			event.preventDefault();
			if (onZoomToFitRef.current) {
				onZoomToFitRef.current();
			}
		},
		{ bindGlobal: true }
	);
}
