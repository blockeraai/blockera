// @flow

/**
 * External dependencies
 */
import type { ComponentType } from 'react';
import { createRoot } from '@wordpress/element';

export class IntersectionObserverRenderer {
	observer: MutationObserver;
	root: string;
	after: string;
	targetSelector: string;
	componentSelector: string;
	Component: ComponentType<any>;

	constructor(
		targetSelector: string,
		Component: ComponentType<any>,
		{
			root,
			after,
			componentSelector,
		}: { root: string, after: string, componentSelector: string }
	) {
		this.root = root;
		this.after = after;
		this.componentSelector = componentSelector;
		this.targetSelector = targetSelector;
		this.Component = Component;

		// Create mutation observer to watch DOM changes
		this.observer = new MutationObserver((mutations) => {
			this.handleDomChanges(mutations);
		});

		// Start observing
		this.startObserving();

		// Initial render
		this.renderComponent();
	}

	startObserving() {
		// Observe the entire document for changes
		if (document.body) {
			this.observer.observe(document.body, {
				childList: true, // Watch for child element changes
				subtree: true, // Watch all descendants
			});
		}
	}

	handleDomChanges(mutations: MutationRecord[]) {
		// Check if our target element was added or removed
		const shouldRerender = mutations.some((mutation) => {
			const addedNodes = Array.from(mutation.addedNodes);
			const removedNodes = Array.from(mutation.removedNodes);

			// Check if target element was added or removed
			return [...addedNodes, ...removedNodes].some((node) => {
				if (node instanceof Element) {
					return (
						node.matches(this.targetSelector) ||
						node.querySelector(this.targetSelector)
					);
				}
				return false;
			});
		});

		if (shouldRerender) {
			this.renderComponent();
		}
	}

	renderComponent() {
		const targetElement = document.querySelector(this.targetSelector);

		if (targetElement && !document.querySelector(this.componentSelector)) {
			// Create a new div to hold our component.
			const containerDiv = document.createElement('div');
			// Append the new container to target instead of replacing content.
			targetElement.appendChild(containerDiv);
			const root = createRoot(containerDiv);
			root.render(<this.Component />);
			containerDiv.remove();
		}

		// TODO: This is a temporary solution to render the component in the mirror of target element while the target element is not available.
		// const observerElementSelector = 'blockera-observer-element';
		// else if (!targetElement) {
		// 	// Create a new div to hold our component
		// 	const containerDiv = document.createElement('div');
		// 	containerDiv.classList.add(this.targetSelector.replace('.', ''));
		// 	containerDiv.classList.add(observerElementSelector);

		// 	if (this.after) {
		// 		document.querySelector(this.after)?.after(containerDiv);
		// 	} else {
		// 		document.querySelector(this.root)?.appendChild(containerDiv);
		// 	}
		// }
		//  else {
		// 	document
		// 		.querySelectorAll(this.targetSelector)
		// 		.forEach((element) => {
		// 			if (element.classList.contains(observerElementSelector)) {
		// 				document
		// 					.querySelector(this.targetSelector)
		// 					?.appendChild(element?.children[0]);
		// 				element.style.display = 'none';
		// 			}
		// 		});
		// }
	}

	destroy() {
		// Clean up observer when done
		this.observer.disconnect();
	}
}
