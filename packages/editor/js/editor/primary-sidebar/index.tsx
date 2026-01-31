/**
 * WordPress dependencies
 */
import { useEffect, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as interfaceStore } from '@wordpress/interface';

/**
 * Internal dependencies
 */
import { store as blockeraEditorStore } from '../store-persistence';
import { ResizeHandle } from '../shared/ResizeHandle';

/**
 * Component that watches the primary sidebar (right panel) state and sets CSS variable
 * to hide it when opened. Handles both edit-post (document sidebar) and edit-site (global-styles sidebar).
 */
export default function PrimarySidebarController() {
	// Cache DOM element reference to avoid repeated queries
	const sidebarContainerRef = useRef<HTMLElement | null>(null);
	// Track if this is the initial mount
	const isInitialMountRef = useRef(true);
	// Track previous sidebar state to detect closing vs switching
	const previousSidebarRef = useRef<string | null | undefined>(undefined);

	// Get dispatch function for updating sidebar width
	const { setPrimarySidebarWidth } = useDispatch(blockeraEditorStore) as {
		setPrimarySidebarWidth: (width: string) => void;
	};

	// Watch the active complementary area from the interface store
	// This tracks both edit-post/document and edit-site/global-styles sidebars
	const activeComplementaryArea = useSelect((select) => {
		const interfaceSelect = select(interfaceStore) as {
			getActiveComplementaryArea: (
				scope: string
			) => string | null | undefined;
		};

		return interfaceSelect.getActiveComplementaryArea('core');
	}, []);

	// Get primary sidebar width from store
	const primarySidebarWidth = useSelect((select) => {
		const storeSelect = select(blockeraEditorStore) as any;
		return storeSelect.getPrimarySidebarWidth();
	}, []);

	// Update CSS variables on body whenever width changes
	// Body always exists, so this is simple and reliable
	useEffect(() => {
		if (!primarySidebarWidth) {
			return;
		}

		// Set CSS variable on body (always exists, variables inherit to all children)
		document.body.style.setProperty(
			'--blockera-primary-sidebar-width',
			primarySidebarWidth
		);
	}, [primarySidebarWidth]);

	// Check if the active sidebar is one of the primary sidebars we track
	// Note: edit-post/block is also a primary sidebar (block settings)
	const isPrimarySidebarOpen =
		activeComplementaryArea === 'edit-post/document' ||
		activeComplementaryArea === 'edit-post/block' ||
		activeComplementaryArea === 'edit-site/global-styles';

	// Initialize sidebar container reference (runs once, retries if not found)
	useEffect(() => {
		const findContainer = () => {
			if (!sidebarContainerRef.current) {
				sidebarContainerRef.current = document.querySelector(
					'.interface-interface-skeleton__sidebar'
				) as HTMLElement | null;
			}
			return sidebarContainerRef.current;
		};

		// Try immediately
		if (!findContainer()) {
			// If not found, retry after a short delay (DOM might not be ready)
			const timeoutId = setTimeout(() => {
				findContainer();
			}, 100);

			return () => clearTimeout(timeoutId);
		}
	}, []);

	// Handle mount and sidebar state changes
	useEffect(() => {
		// Try to find container if not already found (might be added to DOM later)
		if (!sidebarContainerRef.current) {
			sidebarContainerRef.current = document.querySelector(
				'.interface-interface-skeleton__sidebar'
			) as HTMLElement | null;
		}

		if (!sidebarContainerRef.current) {
			return;
		}

		// On mount: set --sidebar-width from store
		if (isInitialMountRef.current) {
			sidebarContainerRef.current.style.removeProperty('--sidebar-width');
			sidebarContainerRef.current.style.removeProperty(
				'--sidebar-width-raw'
			);
			previousSidebarRef.current = activeComplementaryArea;
			isInitialMountRef.current = false;
			return;
		}

		// After mount: handle sidebar state changes
		const previousSidebar = previousSidebarRef.current;
		const wasPrimarySidebarOpen =
			previousSidebar === 'edit-post/document' ||
			previousSidebar === 'edit-post/block' ||
			previousSidebar === 'edit-site/global-styles';

		// Case 1: Changing sidebar (was one open, now another open) - do nothing
		if (wasPrimarySidebarOpen && isPrimarySidebarOpen) {
			// Sidebar switching - no action needed, just update previous state
			previousSidebarRef.current = activeComplementaryArea;
			return;
		}

		// Case 2: Closing sidebar (was open, now closed) - set width to 0
		if (wasPrimarySidebarOpen && !isPrimarySidebarOpen) {
			sidebarContainerRef.current.style.setProperty(
				'--sidebar-width',
				'0'
			);
			sidebarContainerRef.current.style.removeProperty(
				'--sidebar-width-raw'
			);
			previousSidebarRef.current = activeComplementaryArea;
			return;
		}

		// Case 3: Opening sidebar (was closed, now open) - restore width from store with animation
		if (!wasPrimarySidebarOpen && isPrimarySidebarOpen) {
			// Ensure starting point is 0 for smooth animation
			// Use requestAnimationFrame to ensure browser can animate the transition
			const beforeComputed = window
				.getComputedStyle(sidebarContainerRef.current)
				.getPropertyValue('--sidebar-width');
			const fillElement = sidebarContainerRef.current?.querySelector(
				'.interface-complementary-area__fill'
			) as HTMLElement | null;

			// For site editor, ensure the fill element exists and has transition before animating
			// The fill element might not exist immediately when opening in site editor
			if (!fillElement) {
				// Wait for the fill element to be available
				requestAnimationFrame(() => {
					const delayedFillElement =
						sidebarContainerRef.current?.querySelector(
							'.interface-complementary-area__fill'
						) as HTMLElement | null;
					if (delayedFillElement && sidebarContainerRef.current) {
						// Force reflow to ensure 0 width is applied before transitioning to store width
						if (
							beforeComputed !== '0px' &&
							beforeComputed !== '0'
						) {
							sidebarContainerRef.current.style.setProperty(
								'--sidebar-width',
								'0'
							);
							sidebarContainerRef.current.style.removeProperty(
								'--sidebar-width-raw'
							);
							// Force reflow by reading offsetHeight
							void sidebarContainerRef.current.offsetHeight;
						}
						// Use requestAnimationFrame to ensure smooth transition
						requestAnimationFrame(() => {
							if (sidebarContainerRef.current) {
								sidebarContainerRef.current.style.removeProperty(
									'--sidebar-width'
								);
								sidebarContainerRef.current.style.removeProperty(
									'--sidebar-width-raw'
								);
							}
						});
					} else if (sidebarContainerRef.current) {
						// Fallback: set directly if fill element still doesn't exist
						if (
							beforeComputed !== '0px' &&
							beforeComputed !== '0'
						) {
							sidebarContainerRef.current.style.setProperty(
								'--sidebar-width',
								'0'
							);
							sidebarContainerRef.current.style.removeProperty(
								'--sidebar-width-raw'
							);
							// Force reflow by reading offsetHeight
							void sidebarContainerRef.current.offsetHeight;
						}
						requestAnimationFrame(() => {
							if (sidebarContainerRef.current) {
								sidebarContainerRef.current.style.removeProperty(
									'--sidebar-width'
								);
								sidebarContainerRef.current.style.removeProperty(
									'--sidebar-width-raw'
								);
							}
						});
					}
				});
			} else {
				// Fill element exists, proceed with normal animation
				// Force reflow to ensure 0 width is applied before transitioning to store width
				if (beforeComputed !== '0px' && beforeComputed !== '0') {
					sidebarContainerRef.current.style.setProperty(
						'--sidebar-width',
						'0'
					);
					sidebarContainerRef.current.style.removeProperty(
						'--sidebar-width-raw'
					);
					// Force reflow by reading offsetHeight
					void sidebarContainerRef.current.offsetHeight;
				}

				// Use requestAnimationFrame to ensure smooth transition
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						if (sidebarContainerRef.current) {
							sidebarContainerRef.current.style.removeProperty(
								'--sidebar-width'
							);
							sidebarContainerRef.current.style.removeProperty(
								'--sidebar-width-raw'
							);
						}
					});
				});
			}
		}

		// Update previous sidebar state for next comparison
		previousSidebarRef.current = activeComplementaryArea;
	}, [activeComplementaryArea, isPrimarySidebarOpen, primarySidebarWidth]);

	// Handle resize callback - updates store width
	const handleResize = (width: string) => {
		setPrimarySidebarWidth(width);
	};

	return (
		<>
			{/* Resize handle - only show when sidebar is open */}
			{isPrimarySidebarOpen && (
				<ResizeHandle
					side="left"
					isVisible={isPrimarySidebarOpen}
					minWidth={280}
					maxWidth={600}
					defaultValue="300px"
					onResize={handleResize}
				/>
			)}
		</>
	);
}
