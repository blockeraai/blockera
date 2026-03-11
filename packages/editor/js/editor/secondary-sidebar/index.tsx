/**
 * WordPress dependencies
 */
import { useEffect, useRef, useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
	useShortcut,
	store as keyboardShortcutsStore,
} from '@wordpress/keyboard-shortcuts';
import { store as editorStore } from '@wordpress/editor';
import { Fill } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { store as blockeraEditorStore } from '../store-persistence';
import { ResizeHandle } from '../shared/ResizeHandle';
import SecondarySidebar from './components/SecondarySidebar';
import ToggleButton from './components/ToggleButton';

/**
 * Component that injects the combined sidebar into the editor interface using slots.
 * Uses the slot system to render the sidebar content and controls visibility through CSS.
 */
export default function SecondarySidebarInjector() {
	const { setIsInserterOpened, setIsListViewOpened } = useDispatch(
		editorStore
	) as any;
	const { toggleSecondarySidebar, setSecondarySidebarWidth } = useDispatch(
		blockeraEditorStore
	) as unknown as {
		toggleSecondarySidebar: () => void;
		setSecondarySidebarWidth: (width: string) => void;
	};
	const { registerShortcut } = useDispatch(keyboardShortcutsStore);

	// Register Cmd+Shift+, (Ctrl+Shift+, on Windows) for our secondary sidebar toggle.
	// Core's main sidebar shortcut is unregistered and re-bound to Cmd+Shift+. in primary-sidebar.
	useEffect(() => {
		registerShortcut({
			name: 'blockera/secondary-sidebar/toggle',
			category: 'blockera',
			description: __('Show or hide the Settings panel.', 'blockera'),
			keyCombination: {
				modifier: 'primaryShift',
				character: ',',
			},
		});
	}, [registerShortcut]);

	useShortcut('blockera/secondary-sidebar/toggle', toggleSecondarySidebar);

	// Cache DOM element references to avoid repeated queries
	const sidebarContentRef = useRef<HTMLDivElement | null>(null);
	const defaultSidebarRef = useRef<HTMLElement | null>(null);
	const closeAnimationTimeoutRef = useRef<ReturnType<
		typeof setTimeout
	> | null>(null);
	const isInitialMountRef = useRef(true); // Track if this is the first render/page load
	const wasContentRenderedRef = useRef(false); // Track if content was ever rendered

	// Get sidebar visibility state from store
	const isSidebarVisible = useSelect((select) => {
		const storeSelect = select(blockeraEditorStore) as any;
		return storeSelect.isSecondarySidebarVisible();
	}, []);

	// Get secondary sidebar width from store
	const secondarySidebarWidth = useSelect((select) => {
		const storeSelect = select(blockeraEditorStore) as any;
		return storeSelect.getSecondarySidebarWidth();
	}, []);

	// Track initial sidebar state (for determining if we should animate on first open)
	const initialSidebarVisibleRef = useRef<boolean | null>(null);
	if (initialSidebarVisibleRef.current === null) {
		initialSidebarVisibleRef.current = isSidebarVisible;
		// If sidebar is visible initially, content was rendered
		if (isSidebarVisible) {
			wasContentRenderedRef.current = true;
		}
	}

	// Track if SecondarySidebar content should be rendered in DOM
	// When opening: render immediately to allow animation
	// When closing: keep rendered until animation completes, then remove
	const [shouldRenderContent, setShouldRenderContent] =
		useState(isSidebarVisible);

	// Track if content was just rendered (for toggle animation)
	const [isContentJustRendered, setIsContentJustRendered] = useState(false);

	// Monitor the state of default sidebars and keep them disabled
	const { isInserterOpened, isListViewOpened } = useSelect((select) => {
		const editorSelect = select(editorStore) as any;
		return {
			isInserterOpened: editorSelect.isInserterOpened?.() || false,
			isListViewOpened: editorSelect.isListViewOpened?.() || false,
		};
	}, []);

	// Keep default sidebars disabled while our custom sidebar is active
	useEffect(() => {
		if (isInserterOpened) {
			setIsInserterOpened?.(false);
		}

		if (isListViewOpened) {
			setIsListViewOpened?.(false);
		}
	}, [
		isInserterOpened,
		isListViewOpened,
		setIsInserterOpened,
		setIsListViewOpened,
	]);

	// Update CSS variables on body whenever width changes
	// Body always exists, so this is simple and reliable
	useEffect(() => {
		if (!secondarySidebarWidth) {
			return;
		}

		// Set CSS variable on body (always exists, variables inherit to all children)
		document.body.style.setProperty(
			'--blockera-secondary-sidebar-width',
			secondarySidebarWidth
		);
	}, [secondarySidebarWidth]);

	// Apply visibility classes to SecondarySidebar content based on state
	// Content animates margin-left: 0 (visible) or margin-left: -[width] (hidden)
	// Note: Toggle open animation is handled by ref callback, not here
	useEffect(() => {
		if (!sidebarContentRef.current) {
			return;
		}

		if (isSidebarVisible) {
			// Visible state
			const isInitialMount = isInitialMountRef.current;

			if (isInitialMount) {
				// Initial mount: apply visible state immediately (no animation)
				sidebarContentRef.current.classList.remove('is-hidden');
				sidebarContentRef.current.classList.add('is-visible');
				// Mark initial mount as done
				isInitialMountRef.current = false;
				setIsContentJustRendered(false);
			}
			// Note: Toggle open animation is handled by ref callback, not here
		} else {
			// Hidden: set margin-left to negative width (slides off-screen)
			sidebarContentRef.current.classList.remove('is-visible');
			sidebarContentRef.current.classList.add('is-hidden');
			// Mark initial mount as done if we're closing
			if (isInitialMountRef.current) {
				isInitialMountRef.current = false;
			}
			setIsContentJustRendered(false);
		}
	}, [isSidebarVisible, shouldRenderContent]);

	// Initialize default sidebar reference and body class (runs once)
	// Also set CSS variables early to ensure they're available for animations
	useEffect(() => {
		// Find the default secondary sidebar to hide it
		if (!defaultSidebarRef.current) {
			defaultSidebarRef.current = document.querySelector(
				'.interface-interface-skeleton__secondary-sidebar'
			) as HTMLElement | null;
		}

		// Set CSS variable on body during initialization (body always exists)
		if (secondarySidebarWidth) {
			document.body.style.setProperty(
				'--blockera-secondary-sidebar-width',
				secondarySidebarWidth
			);
		}

		// Add class to body for CSS rules (only once)
		document.body.classList.add('has-blockera-combined-sidebar');

		// Hide the default secondary sidebar
		if (defaultSidebarRef.current) {
			defaultSidebarRef.current.style.display = 'none';
		}

		// Cleanup: restore default sidebar visibility if needed
		return () => {
			if (defaultSidebarRef.current) {
				defaultSidebarRef.current.style.display = '';
			}
			document.body.classList.remove('has-blockera-combined-sidebar');
		};
	}, [secondarySidebarWidth]);

	// Handle SecondarySidebar content rendering and animation timing
	// When opening: render immediately and animate in
	// When closing: animate out, then remove from DOM after animation completes (1000ms)
	useEffect(() => {
		// Clear any pending close animation timeout
		if (closeAnimationTimeoutRef.current) {
			clearTimeout(closeAnimationTimeoutRef.current);
			closeAnimationTimeoutRef.current = null;
		}

		if (isSidebarVisible) {
			// Opening: render content immediately to allow animation
			const isInitialMount = isInitialMountRef.current;
			const initialSidebarVisible = initialSidebarVisibleRef.current;

			setShouldRenderContent(true);

			// If not initial mount OR if initial mount but sidebar was closed initially (content was never rendered),
			// mark that content was just rendered (will trigger animation)
			if (!isInitialMount || !initialSidebarVisible) {
				setIsContentJustRendered(true);
			}

			// Mark content as rendered after initial mount
			if (!isInitialMount) {
				wasContentRenderedRef.current = true;
			}
		} else if (sidebarContentRef.current) {
			// Closing: start close animation, then remove content from DOM after animation completes
			// Visibility classes are applied by the separate effect to trigger animation
			// Wait for animation to complete (1000ms) before removing from DOM
			closeAnimationTimeoutRef.current = setTimeout(() => {
				setShouldRenderContent(false);
				closeAnimationTimeoutRef.current = null;
			}, 350); // Match CSS transition duration
		} else {
			// If content not found, remove immediately
			setShouldRenderContent(false);
		}

		// Cleanup: clear timeout on unmount or state change
		return () => {
			if (closeAnimationTimeoutRef.current) {
				clearTimeout(closeAnimationTimeoutRef.current);
				closeAnimationTimeoutRef.current = null;
			}
		};
	}, [isSidebarVisible]);

	// Handle resize callback - updates store width
	const handleResize = (width: string) => {
		setSecondarySidebarWidth(width);
	};

	return (
		<>
			{/* Toggle button in header toolbar */}
			<Fill name="blockera/slots/editor-header-toolbar">
				<ToggleButton
					isVisible={isSidebarVisible}
					onToggle={toggleSecondarySidebar}
				/>
			</Fill>

			<Fill name="blockera/slots/editor-secondary-sidebar">
				{/* SecondarySidebar content - conditionally rendered, animates margin-left */}
				{/* On initial mount: render with is-visible if sidebar should be visible (no animation) */}
				{/* On toggle open: render with is-hidden first, then effect changes to is-visible to trigger animation */}
				{shouldRenderContent && (
					<div
						ref={(el) => {
							sidebarContentRef.current = el;

							// Handle toggle open animation when content is mounted
							// Animate if: (not initial mount OR initial mount but sidebar was closed initially) AND content was just rendered
							const shouldAnimate =
								isContentJustRendered &&
								(!isInitialMountRef.current ||
									(isInitialMountRef.current &&
										!initialSidebarVisibleRef.current));
							if (el && isSidebarVisible && shouldAnimate) {
								// Content was just rendered for toggle open - trigger animation
								requestAnimationFrame(() => {
									requestAnimationFrame(() => {
										if (sidebarContentRef.current === el) {
											sidebarContentRef.current.classList.remove(
												'is-hidden'
											);
											sidebarContentRef.current.classList.add(
												'is-visible'
											);
											setIsContentJustRendered(false);
										}
									});
								});
							}
						}}
						className={`blockera-secondary-sidebar-content ${
							isInitialMountRef.current &&
							isSidebarVisible &&
							initialSidebarVisibleRef.current
								? 'is-visible'
								: 'is-hidden'
						}`}
					>
						{/* Resize handle - only show when sidebar is visible */}
						{isSidebarVisible && (
							<ResizeHandle
								side="right"
								isVisible={isSidebarVisible}
								minWidth={280}
								maxWidth={600}
								defaultValue="350px"
								onResize={handleResize}
							/>
						)}
						<SecondarySidebar />
					</div>
				)}
			</Fill>
		</>
	);
}
