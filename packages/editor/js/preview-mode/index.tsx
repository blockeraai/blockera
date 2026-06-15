/**
 * WordPress dependencies
 */
import { useState, useCallback, useEffect, useRef } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
	useShortcut,
	store as keyboardShortcutsStore,
} from '@wordpress/keyboard-shortcuts';
import { registerPlugin } from '@wordpress/plugins';
import type { MouseEvent, ReactElement, KeyboardEvent } from 'react';

/**
 * Internal dependencies
 */
import PreviewButton from './components/PreviewButton';
import PreviewOverlay from './components/PreviewOverlay';
import { useCurrentEntity } from '../hooks';
import { usePrefetchPreview } from './hooks/usePrefetchPreview';
import { saveGlobalStylesWordPressCompatibilityBeforePostSave } from '../editor/global-styles/save-compatibility';

/**
 * BlockeraPreview component - Main container for the preview feature.
 * Manages the overlay state and coordinates between button and overlay.
 *
 * @return The preview button and overlay components.
 */
function BlockeraPreview(): ReactElement {
	const [isOverlayOpen, setIsOverlayOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const {
		isSaveable,
		isViewable,
		hasValidViewUrl,
		getPreviewUrl,
		viewUrl,
		dirty,
	} = useCurrentEntity();

	const { registerShortcut } = useDispatch(keyboardShortcutsStore);

	// Use refs to access latest values without causing re-renders
	const isOverlayOpenRef = useRef(isOverlayOpen);
	const isClosingRef = useRef(isClosing);
	const getPreviewUrlRef = useRef(getPreviewUrl);
	const handleCloseRef = useRef<() => void>();

	// Update refs when values change
	useEffect(() => {
		isOverlayOpenRef.current = isOverlayOpen;
		isClosingRef.current = isClosing;
		getPreviewUrlRef.current = getPreviewUrl;
	}, [isOverlayOpen, isClosing, getPreviewUrl]);

	// Register keyboard shortcuts for preview mode
	useEffect(() => {
		// Toggle preview mode: Cmd+P / Ctrl+P
		registerShortcut({
			name: 'blockera/preview-mode/toggle',
			category: 'blockera',
			description: __('Toggle preview mode.', 'blockera'),
			keyCombination: {
				modifier: 'primary',
				character: 'p',
			},
		});

		// Open preview in new tab: Cmd+Shift+P / Ctrl+Shift+P
		registerShortcut({
			name: 'blockera/preview-mode/open-new-tab',
			category: 'blockera',
			description: __('Open preview in a new tab.', 'blockera'),
			keyCombination: {
				modifier: 'primaryShift',
				character: 'p',
			},
		});
	}, [registerShortcut]);

	// Prefetch hook - triggers browser prefetch on hover when conditions are met
	const { handleMouseEnter } = usePrefetchPreview({
		viewUrl,
		dirty,
		hasValidViewUrl,
	});

	/**
	 * Close the overlay with animation.
	 */
	const handleClose = useCallback((): void => {
		setIsClosing(true);

		// Wait for animation to complete, then hide overlay
		setTimeout(() => {
			setIsOverlayOpen(false);
			setIsClosing(false);
			setPreviewUrl(null);
		}, 350); // Match CSS animation duration + buffer
	}, []);

	// Store handleClose in ref for keyboard shortcut handler
	useEffect(() => {
		handleCloseRef.current = handleClose;
	}, [handleClose]);

	const getPreviewUrlWithGlobalStylesCompatibility =
		useCallback(async (): Promise<string | null> => {
			await saveGlobalStylesWordPressCompatibilityBeforePostSave();

			return getPreviewUrl();
		}, [getPreviewUrl]);

	/**
	 * Handle keyboard shortcut to toggle preview mode.
	 * Toggles the overlay open/closed when Cmd+P (Mac) or Ctrl+P (Windows) is pressed.
	 */
	const handleKeyboardShortcut = useCallback(
		async (event: KeyboardEvent): Promise<void> => {
			event.preventDefault();

			// Don't toggle if already closing (prevents double-trigger)
			if (isClosingRef.current) {
				return;
			}

			// Toggle overlay
			if (isOverlayOpenRef.current) {
				// Close overlay
				handleCloseRef.current?.();
			} else {
				// Open overlay - get fresh preview URL (saves post if needed)
				await saveGlobalStylesWordPressCompatibilityBeforePostSave();
				const url = await getPreviewUrlRef.current();
				if (url) {
					setPreviewUrl(url);
					setIsOverlayOpen(true);
				}
			}
		},
		[]
	);

	/**
	 * Handle keyboard shortcut to open preview in new tab.
	 * Opens preview in a new tab when Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows) is pressed.
	 */
	const handleOpenNewTabShortcut = useCallback(
		async (event: KeyboardEvent): Promise<void> => {
			event.preventDefault();
			await saveGlobalStylesWordPressCompatibilityBeforePostSave();
			const url = await getPreviewUrlRef.current();
			if (url) {
				window.open(url, '_blank', 'noopener,noreferrer');
			}
		},
		[]
	);

	// Bind keyboard shortcuts
	useShortcut('blockera/preview-mode/toggle', handleKeyboardShortcut);
	useShortcut('blockera/preview-mode/open-new-tab', handleOpenNewTabShortcut);

	/**
	 * Handle click on the preview button.
	 * - With Ctrl/Cmd: opens preview in new tab (native behavior)
	 * - Without modifiers: toggles the in-editor preview overlay
	 */
	const handleClick = useCallback(
		async (event: MouseEvent<HTMLAnchorElement>): Promise<void> => {
			// Check for modifier keys - open in new tab like core behavior
			if (event.metaKey || event.ctrlKey) {
				event.preventDefault();
				const url = await getPreviewUrlWithGlobalStylesCompatibility();
				if (url) {
					window.open(url, '_blank', 'noopener,noreferrer');
				}
				return;
			}

			// Toggle overlay
			if (isOverlayOpen) {
				// Use the same close animation as the overlay's close button
				handleClose();
			} else {
				// Get fresh preview URL (saves post if needed)
				const url = await getPreviewUrlWithGlobalStylesCompatibility();
				if (url) {
					setPreviewUrl(url);
					setIsOverlayOpen(true);
				}
			}
		},
		[isOverlayOpen, getPreviewUrlWithGlobalStylesCompatibility, handleClose]
	);

	// Determine if the button should be disabled:
	// - Post type is not viewable (e.g., reusable blocks, navigation menus)
	// - Post is not in a saveable state
	// - Preview URL is not valid
	const isDisabled = !isViewable || !isSaveable || !hasValidViewUrl;

	return (
		<>
			<PreviewButton
				onClick={handleClick}
				onMouseEnter={handleMouseEnter}
				isActive={isOverlayOpen}
				disabled={isDisabled}
				href={viewUrl}
			/>
			{isOverlayOpen && previewUrl && (
				<PreviewOverlay
					url={previewUrl}
					onClose={handleClose}
					isClosing={isClosing}
				/>
			)}
		</>
	);
}

// Register the plugin with WordPress
registerPlugin('blockera-preview', {
	render: BlockeraPreview,
	icon: null,
});

// Export bootstrap function
export { bootstrapPreviewMode } from './bootstrap';
