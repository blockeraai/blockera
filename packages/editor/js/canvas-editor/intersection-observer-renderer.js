// @flow

/**
 * External dependencies
 */
import type { ComponentType } from 'react';
import { createRoot } from '@wordpress/element';

export class IntersectionObserverRenderer {
	observer: MutationObserver;
	targetSelector: string;
	whileNotExistSelectors: string[];
	componentSelector: string;
	Component: ComponentType<any>;
	targetElementIsRoot: boolean;
	callback: Function;
	onShouldNotRenderer: boolean;

	constructor(
		targetSelector: string,
		Component: ComponentType<any>,
		{
			whileNotExistSelectors = [],
			componentSelector = '',
			callback = null,
			targetElementIsRoot = false,
			onShouldNotRenderer = false,
		}: {
			callback: Function,
			root: string,
			after: string,
			componentSelector: string,
			whileNotExistSelectors: string[],
			targetElementIsRoot: boolean,
			onShouldNotRenderer: boolean,
		} = {}
	) {
		this.whileNotExistSelectors = whileNotExistSelectors;
		this.componentSelector = componentSelector;
		this.targetSelector = targetSelector;
		this.Component = Component;
		this.callback = callback;
		this.targetElementIsRoot = targetElementIsRoot;
		this.onShouldNotRenderer = onShouldNotRenderer;

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

		if (shouldRerender && this.Component) {
			this.renderComponent();
		}

		if (shouldRerender && 'function' === typeof this.callback) {
			this.callback();
		}

		if (!shouldRerender && 'function' === typeof this.onShouldNotRenderer) {
			this.onShouldNotRenderer();
		}
	}

	renderComponent() {
		const targetElement = document.querySelector(this.targetSelector);

		if (targetElement && !document.querySelector(this.componentSelector)) {
			if (this.whileNotExistSelectors.length > 0) {
				const shouldRender = this.whileNotExistSelectors.every(
					(selector) => !document.querySelector(selector)
				);

				if (!shouldRender) {
					return;
				}
			}

			if (this.targetElementIsRoot) {
				// Check if this.targetElement is a valid DOM element
				if (!(targetElement instanceof Element)) {
					return;
				}

				const containerDiv = document.createElement('div');
				const root = createRoot(containerDiv);
				root.render(
					<this.Component clickedBlock={this.clickedBlock} />
				);

				// If the target element is an iframe, append the container to the iframe body.
				if ('IFRAME' === targetElement.tagName) {
					targetElement.contentDocument.body.appendChild(
						containerDiv
					);
				}

				return;
			}

			// Create a new div to hold our component.
			const containerDiv = document.createElement('div');
			// Append the new container to target instead of replacing content.
			targetElement.appendChild(containerDiv);
			const root = createRoot(containerDiv);
			root.render(<this.Component />);
			containerDiv.remove();
		}
	}

	destroy() {
		// Clean up observer when done
		this.observer.disconnect();
	}
}
