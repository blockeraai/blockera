/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState, useCallback, createPortal } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './ResizeHandle.css';

/**
 * Props for the ResizeHandle component.
 */
type ResizeHandleProps = {
	/**
	 * Which side the handle is on ('left', 'right', or 'top').
	 * 'left' and 'right' are for horizontal resizing (width in pixels).
	 * 'top' is for vertical resizing (height in percentage).
	 */
	side: 'left' | 'right' | 'top';
	/**
	 * Whether the sidebar is visible/open (handle only works when true).
	 */
	isVisible: boolean;
	/**
	 * Minimum width/height (pixels for 'left'/'right', percentage for 'top').
	 */
	minWidth: number;
	/**
	 * Maximum width/height (pixels for 'left'/'right', percentage for 'top').
	 */
	maxWidth: number;
	/**
	 * Callback called during resize with the new value (as string, e.g., '300px' or '50%').
	 */
	onResize: (value: string) => void;
	/**
	 * Optional callback called when resize starts.
	 */
	onResizeStart?: () => void;
	/**
	 * Optional callback called when resize ends.
	 */
	onResizeEnd?: () => void;
};

/**
 * Reusable resize handle component for sidebars.
 * Shows a 4px handle after 300ms of hovering, allows dragging to resize.
 *
 * @param {ResizeHandleProps} props Component props.
 * @return {JSX.Element | null} The resize handle element or null if not visible.
 */
export const ResizeHandle = ({
	side,
	isVisible,
	minWidth,
	maxWidth,
	onResize,
	onResizeStart,
	onResizeEnd,
}: ResizeHandleProps) => {
	// Track hover state and timeout for 300ms delay
	const [showHandle, setShowHandle] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [isAtLimit, setIsAtLimit] = useState(false); // Track if min/max limit is hit
	const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const handleRef = useRef<HTMLDivElement | null>(null);
	const [container, setContainer] = useState<HTMLElement | null>(null);
	const startXRef = useRef<number>(0);
	const startYRef = useRef<number>(0);
	const startWidthRef = useRef<number>(0);
	const startHeightRef = useRef<number>(0);
	const rafRef = useRef<number | null>(null);

	// Determine if this is a vertical resize (top) or horizontal resize (left/right)
	const isVertical = side === 'top';

	// Find the sidebar container element
	// For primary sidebar: .interface-interface-skeleton__sidebar
	// For secondary sidebar: .blockera-secondary-sidebar-content
	useEffect(() => {
		if (!isVisible) {
			setContainer(null);
			return;
		}

		const findContainer = () => {
			if (side === 'left') {
				// Primary sidebar (right side of screen, resizable from left)
				return document.querySelector('.interface-interface-skeleton__sidebar') as HTMLElement | null;
			} else if (side === 'right') {
				// Secondary sidebar (left side of screen, resizable from right)
				return document.querySelector('.blockera-secondary-sidebar-content') as HTMLElement | null;
			} else {
				// Top: List view panel for vertical resizing (handle positioned on top of it)
				return document.querySelector('.blockera-combined-sidebar__list-view') as HTMLElement | null;
			}
		};

		const foundContainer = findContainer();
		if (foundContainer) {
			setContainer(foundContainer);
			return;
		}

		// Retry if not found (DOM might not be ready)
		const timeoutId = setTimeout(() => {
			const retryContainer = findContainer();
			if (retryContainer) {
				setContainer(retryContainer);
			}
		}, 100);
		return () => clearTimeout(timeoutId);
	}, [isVisible, side]);

	// Handle hover detection with 300ms delay
	const handleMouseEnter = useCallback(() => {
		if (!isVisible || isDragging) {
			return;
		}

		// Clear any existing timeout
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
		}

		// Show handle after 300ms
		hoverTimeoutRef.current = setTimeout(() => {
			if (!isDragging) {
				setShowHandle(true);
			}
		}, 300);
	}, [isVisible, isDragging]);

	const handleMouseLeave = useCallback(() => {
		// Clear timeout if mouse leaves before 300ms
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
			hoverTimeoutRef.current = null;
		}

		// Hide handle if not dragging
		if (!isDragging) {
			setShowHandle(false);
		}
	}, [isDragging]);

	// Handle drag start
	const handleMouseDown = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!isVisible || !container) {
				return;
			}

			e.preventDefault();
			e.stopPropagation();

			// Prevent text selection during drag
			document.body.style.userSelect = 'none';
			document.body.style.cursor = isVertical ? 'row-resize' : 'col-resize';

			setIsDragging(true);
			setShowHandle(true);
			startXRef.current = e.clientX;
			startYRef.current = e.clientY;

			// Disable transitions on container and related elements while dragging
			if (container) {
				container.classList.add('is-resizing');
				// Also disable transitions on nested elements for primary sidebar
				if (side === 'left') {
					const fillElement = container.querySelector('.interface-complementary-area__fill') as HTMLElement | null;
					if (fillElement) {
						fillElement.classList.add('is-resizing');
						const areaElement = fillElement.querySelector('.interface-complementary-area') as HTMLElement | null;
						if (areaElement) {
							areaElement.classList.add('is-resizing');
						}
					}
				}
				// For 'top' type, the container is already the combined sidebar, so is-resizing class is sufficient
			}

			// Get current width/height from CSS variable or computed style
			if (isVertical) {
				// Vertical resize: get height percentage
				const heightPercentage = (() => {
					// Get the combined sidebar container for height calculation
					const combinedSidebar = container.closest('.blockera-combined-sidebar') as HTMLElement | null;
					if (!combinedSidebar) {
						return 50; // Default 50%
					}

					// Try to get from CSS variable first
					const cssVar = window.getComputedStyle(combinedSidebar).getPropertyValue('--list-view-height');
					if (cssVar) {
						return parseFloat(cssVar);
					}

					// Fallback: calculate from list view element height
					const containerHeight = combinedSidebar.getBoundingClientRect().height;
					const listViewHeight = container.getBoundingClientRect().height;
					return containerHeight > 0 ? (listViewHeight / containerHeight) * 100 : 50;
				})();
				startHeightRef.current = heightPercentage;
			} else {
				// Horizontal resize: get width in pixels
				const currentWidth = (() => {
					if (side === 'left') {
						// Primary sidebar: get from --sidebar-width-raw or computed width
						const rawWidth = container.style.getPropertyValue('--sidebar-width-raw');
						if (rawWidth) {
							return parseFloat(rawWidth);
						}
						const computed = window.getComputedStyle(container).getPropertyValue('--sidebar-width');
						return parseFloat(computed) || 300;
					} else {
						// Secondary sidebar: get from CSS variable or computed width
						const computed = window.getComputedStyle(container).width;
						return parseFloat(computed) || 350;
					}
				})();
				startWidthRef.current = currentWidth;
			}

			// Call resize start callback
			onResizeStart?.();

			// Wrap handleMouseUp to pass the event (defined before handleMouseUp)
			let wrappedHandleMouseUp: ((event: MouseEvent) => void) | null = null;

			// Add global mouse event listeners
			const handleMouseMove = (moveEvent: MouseEvent) => {
				if (!container) {
					return;
				}

				// Cancel any pending animation frame
				if (rafRef.current !== null) {
					cancelAnimationFrame(rafRef.current);
				}

				// Use requestAnimationFrame for smooth updates
				rafRef.current = requestAnimationFrame(() => {
					if (!container) {
						return;
					}

					if (isVertical) {
						// Vertical resize: calculate percentage based on mouse Y position
						// Need to get the combined sidebar container for height calculation
						const combinedSidebar = container.closest('.blockera-combined-sidebar') as HTMLElement | null;
						if (!combinedSidebar) {
							return;
						}

						const containerRect = combinedSidebar.getBoundingClientRect();
						const containerHeight = containerRect.height;
						if (containerHeight <= 0) {
							return;
						}

						// Calculate percentage based on mouse Y position relative to container
						// Dragging handle UP (toward top, smaller Y) should INCREASE list view height
						// Dragging handle DOWN (toward bottom, larger Y) should DECREASE list view height
						const mouseYRelative = moveEvent.clientY - containerRect.top;
						// Invert: map mouse position to height percentage
						// When mouse is at top (0), list view should be max percentage
						// When mouse is at bottom (containerHeight), list view should be min percentage
						const normalizedPosition = mouseYRelative / containerHeight; // 0 at top, 1 at bottom
						let newHeightPercentage = maxWidth - (normalizedPosition * (maxWidth - minWidth));

						// Apply min/max constraints (as percentages)
						const beforeConstraint = newHeightPercentage;
						newHeightPercentage = Math.max(minWidth, Math.min(maxWidth, newHeightPercentage));

						// Check if constraint was applied (we hit a limit)
						// Use Math.abs to handle floating point precision issues
						setIsAtLimit(Math.abs(beforeConstraint - newHeightPercentage) > 0.01);

						// Update height via callback (will update store and CSS variables)
						const heightString = `${newHeightPercentage}%`;
						onResize(heightString);
					} else {
						// Horizontal resize: calculate width based on mouse movement
						const deltaX = moveEvent.clientX - startXRef.current;
						let newWidth: number;

						if (side === 'left') {
							// Primary sidebar: dragging left decreases width, dragging right increases width
							newWidth = startWidthRef.current - deltaX;
						} else {
							// Secondary sidebar: dragging right increases width, dragging left decreases width
							newWidth = startWidthRef.current + deltaX;
						}

						// Apply min/max constraints
						const beforeConstraint = newWidth;
						newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

						// Check if constraint was applied (we hit a limit)
						// Use Math.abs to handle floating point precision issues
						setIsAtLimit(Math.abs(beforeConstraint - newWidth) > 0.01);

						// Update width via callback (will update store and CSS variables)
						const widthString = `${newWidth}px`;
						onResize(widthString);
					}
				});
			};

			const handleMouseUp = (upEvent?: MouseEvent) => {
				// Cancel any pending animation frame
				if (rafRef.current !== null) {
					cancelAnimationFrame(rafRef.current);
					rafRef.current = null;
				}

				// Restore text selection and cursor
				document.body.style.userSelect = '';
				document.body.style.cursor = '';

				// Re-enable transitions on container and related elements
				if (container) {
					container.classList.remove('is-resizing');
					// Also re-enable transitions on nested elements for primary sidebar
					if (side === 'left') {
						const fillElement = container.querySelector('.interface-complementary-area__fill') as HTMLElement | null;
						if (fillElement) {
							fillElement.classList.remove('is-resizing');
							const areaElement = fillElement.querySelector('.interface-complementary-area') as HTMLElement | null;
							if (areaElement) {
								areaElement.classList.remove('is-resizing');
							}
						}
					}
				}

				setIsDragging(false);
				setIsAtLimit(false); // Reset limit state when drag ends

				// Check if mouse is still over the handle element
				// If not, hide the handle immediately
				if (handleRef.current && upEvent) {
					const handleRect = handleRef.current.getBoundingClientRect();
					const isMouseOverHandle =
						upEvent.clientX >= handleRect.left &&
						upEvent.clientX <= handleRect.right &&
						upEvent.clientY >= handleRect.top &&
						upEvent.clientY <= handleRect.bottom;

					if (!isMouseOverHandle) {
						// Mouse is not over handle, hide it immediately
						setShowHandle(false);
					}
					// If mouse is still over handle, keep it visible (will hide on mouseleave)
				} else {
					// If we can't determine mouse position, hide the handle
					// It will show again on hover with the 300ms delay
					setShowHandle(false);
				}

				// Call resize end callback
				onResizeEnd?.();

				// Remove global listeners
				document.removeEventListener('mousemove', handleMouseMove);
				if (wrappedHandleMouseUp) {
					document.removeEventListener('mouseup', wrappedHandleMouseUp);
				}
			};

			// Create wrapper function that passes the event
			wrappedHandleMouseUp = (upEvent: MouseEvent) => {
				handleMouseUp(upEvent);
			};

			// Add global listeners
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', wrappedHandleMouseUp);
		},
		[isVisible, side, minWidth, maxWidth, onResize, onResizeStart, onResizeEnd, container, isVertical]
	);

	// Cleanup: hide handle and clear timeout when sidebar closes or component unmounts
	useEffect(() => {
		if (!isVisible) {
			setShowHandle(false);
			setIsDragging(false);
			setIsAtLimit(false);
			if (hoverTimeoutRef.current) {
				clearTimeout(hoverTimeoutRef.current);
				hoverTimeoutRef.current = null;
			}
			// Remove resizing class if sidebar closes during drag
			if (container) {
				container.classList.remove('is-resizing');
				if (side === 'left') {
					const fillElement = container.querySelector('.interface-complementary-area__fill') as HTMLElement | null;
					if (fillElement) {
						fillElement.classList.remove('is-resizing');
						const areaElement = fillElement.querySelector('.interface-complementary-area') as HTMLElement | null;
						if (areaElement) {
							areaElement.classList.remove('is-resizing');
						}
					}
				}
			}
		}
	}, [isVisible, container, side]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (hoverTimeoutRef.current) {
				clearTimeout(hoverTimeoutRef.current);
			}
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
			}
			// Restore text selection and cursor if component unmounts during drag
			document.body.style.userSelect = '';
			document.body.style.cursor = '';
			// Remove resizing class if component unmounts during drag
			if (container) {
				container.classList.remove('is-resizing');
				if (side === 'left') {
					const fillElement = container.querySelector('.interface-complementary-area__fill') as HTMLElement | null;
					if (fillElement) {
						fillElement.classList.remove('is-resizing');
						const areaElement = fillElement.querySelector('.interface-complementary-area') as HTMLElement | null;
						if (areaElement) {
							areaElement.classList.remove('is-resizing');
						}
					}
				}
			}
		};
	}, [container, side]);

	// Don't render if sidebar is not visible or container not found
	if (!isVisible || !container) {
		return null;
	}

	// Render handle inside the sidebar container using portal for proper positioning
	const handleElement = (
		<div
			ref={handleRef}
			className={`blockera-sidebar-resize-handle blockera-sidebar-resize-handle--${side} ${showHandle || isDragging ? 'is-visible' : ''} ${isAtLimit ? 'is-at-limit' : ''}`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onMouseDown={handleMouseDown}
			aria-label={__('Resize sidebar', 'blockera-tabs')}
			role="separator"
			aria-orientation={isVertical ? 'horizontal' : 'vertical'}
		/>
	);

	return createPortal(handleElement, container);
};
