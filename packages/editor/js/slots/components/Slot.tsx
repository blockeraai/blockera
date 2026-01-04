/**
 * WordPress dependencies
 */
import { useState, useEffect, useRef, createPortal } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { Slot } from '@wordpress/components';
import type { ReactNode } from 'react';

/**
 * Internal dependencies
 */
import { getSlotConfig, slotIdToClassName } from '../constants';
import type { SlotProps } from '../types';

/**
 * Generic Slot component that finds a container using configured selectors.
 * Handles finding the container and rendering the Slot using WordPress SlotFill.
 * Uses MutationObserver to wait for the container to appear if not immediately available.
 *
 * @param props - Component props.
 * @returns The Slot component rendered in the container, or null if container not found.
 */
export default function GenericSlot({
	slotId,
	className,
	onSlotCreated,
}: SlotProps): ReactNode {
	const [container, setContainer] = useState<HTMLElement | null>(null);
	const containerFoundRef = useRef(false);
	// Use ref for callback to avoid stale closures and unnecessary effect dependencies
	const onSlotCreatedRef = useRef(onSlotCreated);

	// Get slot config to check for isActive function
	const slotConfig = getSlotConfig(slotId);

	// Check if slot should be active using isActive function if provided
	// This follows the same pattern as KeyboardShortcutsExtension checking modal state
	const isActive = useSelect(
		(select) => {
			if (!slotConfig?.isActive) {
				// If no isActive function is provided, slot is always active
				return true;
			}
			return slotConfig.isActive(select);
		},
		[slotConfig?.isActive]
	) as boolean;

	// Keep callback ref up to date when prop changes
	useEffect(() => {
		onSlotCreatedRef.current = onSlotCreated;
	}, [onSlotCreated]);

	useEffect(() => {
		// If slot is not active, don't setup container
		if (!isActive) {
			setContainer(null);
			containerFoundRef.current = false;
			onSlotCreatedRef.current?.(false);
			return;
		}

		if (!slotConfig) {
			// @debug-ignore
			console.warn(`[Blockera Slots] Slot configuration not found for: ${slotId}`);
			onSlotCreatedRef.current?.(false);
			return;
		}

		// Determine if we should create a container or use the found one directly
		// Defaults to true for backward compatibility (undefined/null means create container)
		const shouldCreateContainer = slotConfig.createContainer ?? true;

		/**
		 * Try to find the container using selectors in priority order.
		 * Returns an object with the container element and the found selector element.
		 * For fallback selectors that target child elements, uses the parent as container.
		 */
		const findContainer = (): { container: HTMLElement; foundElement: HTMLElement } | null => {
			for (let i = 0; i < slotConfig.selectors.length; i++) {
				const selector = slotConfig.selectors[i];
				const element = document.querySelector(selector);

				if (element instanceof HTMLElement) {
					// Check if this is a fallback selector (not the first one)
					// and if the element's parent is likely the actual container
					// This handles cases like '.editor-header__post-preview-button' where we want the parent
					if (i > 0 && element.parentNode instanceof HTMLElement) {
						// Use parent as container for fallback selectors
						return {
							container: element.parentNode,
							foundElement: element,
						};
					}
					return {
						container: element,
						foundElement: element,
					};
				}
			}
			return null;
		};

		/**
		 * Create or find the root container and insert it into the found container.
		 * Returns the root element if successful, null otherwise.
		 */
		const setupRootContainer = (
			parentContainer: HTMLElement,
			foundElement: HTMLElement
		): HTMLElement | null => {
			// Compute class names once to avoid repeated function calls
			const autoClassName = slotIdToClassName(slotId);
			const configClassName = slotConfig.className || autoClassName;

			// Check if root already exists (try both config className and auto-generated)
			let root = parentContainer.querySelector(`.${configClassName}`) as HTMLElement | null;
			if (!root && slotConfig.className) {
				// Also check for auto-generated class name in case it was created before
				root = parentContainer.querySelector(`.${autoClassName}`) as HTMLElement | null;
			}

			if (!root) {
				root = document.createElement('div');
				// Use config className if provided, otherwise use auto-generated
				// Also append prop className if provided (for additional classes)
				root.className = `${configClassName}${className ? ` ${className}` : ''}`;

				const placement = slotConfig.placement || 'start';

				// If placementSelector is provided, find that element inside the container
				if (slotConfig.placementSelector) {
					const placementElement = parentContainer.querySelector(slotConfig.placementSelector);
					if (placementElement instanceof HTMLElement) {
						if (placement === 'before') {
							placementElement.parentNode?.insertBefore(root, placementElement);
						} else if (placement === 'after') {
							placementElement.parentNode?.insertBefore(root, placementElement.nextSibling);
						} else if (placement === 'end') {
							parentContainer.append(root);
						} else {
							// 'start' or default
							parentContainer.prepend(root);
						}
					} else {
						// Fallback: if placementSelector not found, use default behavior
						if (placement === 'end') {
							parentContainer.append(root);
						} else {
							parentContainer.prepend(root);
						}
					}
				} else {
					// No placementSelector: use placement relative to container or found element
					if (placement === 'before') {
						// Insert before the found selector element itself
						foundElement.parentNode?.insertBefore(root, foundElement);
					} else if (placement === 'after') {
						// Insert after the found selector element itself
						foundElement.parentNode?.insertBefore(root, foundElement.nextSibling);
					} else if (placement === 'end') {
						parentContainer.append(root);
					} else {
						// 'start' or default
						parentContainer.prepend(root);
					}
				}
			}

			return root;
		};

		/**
		 * Attempt to find container and setup root.
		 * Returns true if successful, false otherwise.
		 */
		const trySetup = (): boolean => {
			const result = findContainer();
			if (result) {
				let targetContainer: HTMLElement;

				if (shouldCreateContainer) {
					// Create a container element as before
					const root = setupRootContainer(result.container, result.foundElement);
					if (!root) {
						return false;
					}
					targetContainer = root;
				} else {
					// Use the found container directly without creating a wrapper element
					// This is useful when you want to render fills directly into an existing DOM element
					targetContainer = result.container;
				}

				setContainer(targetContainer);
				containerFoundRef.current = true;
				// Notify callback that slot was successfully created
				onSlotCreatedRef.current?.(true);
				return true;
			}
			return false;
		};

		// Try immediately
		if (trySetup()) {
			return;
		}

		// If not found, set up MutationObserver to watch for container to appear
		// Observer disconnects immediately when container is found to avoid unnecessary callbacks
		const observer = new MutationObserver(() => {
			if (!containerFoundRef.current && trySetup()) {
				observer.disconnect();
			}
		});

		// Observe document body for changes (subtree needed to catch nested additions)
		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		// Fallback: try again after a short delay (in case MutationObserver misses it)
		const timeoutId = setTimeout(() => {
			if (!containerFoundRef.current && trySetup()) {
				observer.disconnect();
			} else if (!containerFoundRef.current) {
				// Notify that slot creation failed after timeout
				onSlotCreatedRef.current?.(false);
			}
		}, 1000);

		// Cleanup on unmount
		return () => {
			clearTimeout(timeoutId);
			observer.disconnect();
		};
	}, [slotId, className, isActive, slotConfig]);

	// Don't render if slot is not active or container is not available
	if (!isActive || !container) {
		return null;
	}

	// Render Slot inside the container using portal
	// WordPress SlotFill maintains registration order, so fills will render
	// in the order they were registered (controlled by component mount order)
	return createPortal(
		<Slot name={slotId} />,
		container
	);
}
