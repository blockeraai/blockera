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
	Component: null | ComponentType<any>;
	targetElementIsRoot: boolean;
	callback: Function;
	onShouldNotRenderer: boolean;
	isRootComponent: boolean;
	isRendered: boolean;
	clickedBlock: boolean;
	cachedRoot: any;
	cachedContainer: HTMLElement | null;
	renderTimeout: TimeoutID | null;

	constructor(
		targetSelector: string,
		Component: ComponentType<any> | null,
		{
			whileNotExistSelectors = [],
			componentSelector = '',
			callback = null,
			targetElementIsRoot = false,
			onShouldNotRenderer = false,
			isRootComponent = false,
		}: {
			callback?: Function,
			root?: string,
			componentSelector?: string,
			whileNotExistSelectors?: string[],
			targetElementIsRoot?: boolean,
			onShouldNotRenderer?: boolean,
			isRootComponent?: any,
		} = {}
	) {
		this.whileNotExistSelectors = whileNotExistSelectors;
		this.componentSelector = componentSelector;
		this.targetSelector = targetSelector;
		this.Component = Component;
		this.callback = callback;
		this.targetElementIsRoot = targetElementIsRoot;
		this.onShouldNotRenderer = onShouldNotRenderer;
		this.isRootComponent = isRootComponent;
		this.cachedRoot = null;
		this.cachedContainer = null;
		this.renderTimeout = null;

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
				attributes: true, // Watch for attribute changes
				attributeFilter: ['value'], // Watch for input value changes
			});
		}
	}

	handleDomChanges(mutations: MutationRecord[]) {
		// Check if our target element was added or removed
		const shouldRerender = mutations.some((mutation) => {
			// Detect node addition/removal
			const addedNodes = Array.from(mutation.addedNodes);
			const removedNodes = Array.from(mutation.removedNodes);

			const nodeChanged = [...addedNodes, ...removedNodes].some(
				(node) => {
					if (node instanceof Element) {
						return (
							node.matches(this.targetSelector) ||
							node.querySelector(this.targetSelector)
						);
					}
					return false;
				}
			);

			// Detect attribute changes on target element
			const attrChanged =
				mutation.type === 'attributes' &&
				mutation.target instanceof Element &&
				mutation.target.matches(this.targetSelector);

			if (
				this.targetElementIsRoot &&
				this.cachedRoot &&
				this.cachedContainer
			) {
				this.cachedRoot = null;
				this.cachedContainer = null;
			}

			return nodeChanged || attrChanged;
		});

		if (shouldRerender && this.Component) {
			// Debounce render calls
			if (this.renderTimeout) {
				clearTimeout(this.renderTimeout);
			}
			this.renderTimeout = setTimeout(() => {
				this.renderComponent();
			}, 100);
		}

		if ('function' === typeof this.callback) {
			this.callback();
		}

		if (!shouldRerender && 'function' === typeof this.onShouldNotRenderer) {
			this.onShouldNotRenderer();
		}
	}

	renderComponent() {
		if (this.isRendered) return;

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

				if (!this.cachedContainer) {
					this.cachedContainer = document.createElement('div');
					this.cachedRoot = createRoot(this.cachedContainer);
				}

				if (this.Component) {
					this.cachedRoot.render(
						<this.Component clickedBlock={this.clickedBlock} />
					);
				}

				// If the target element is an iframe, append the container to the iframe body.
				if (
					'IFRAME' === targetElement.tagName &&
					// $FlowFixMe
					targetElement?.contentDocument?.body
				) {
					// $FlowFixMe
					targetElement.contentDocument.body.appendChild(
						this.cachedContainer
					);

					// If the component is a root component, set the isRendered flag to true, because it will be rendered only once.
					if (this.isRootComponent) {
						this.isRendered = true;
					}
				}

				return;
			}

			// Reuse cached container and root if available
			if (!this.cachedContainer) {
				this.cachedContainer = document.createElement('div');
				this.cachedRoot = createRoot(this.cachedContainer);
			}

			if (this.cachedContainer) {
				targetElement.appendChild(this.cachedContainer);
			}

			if (this.Component) {
				this.cachedRoot.render(<this.Component />);
			}

			// If the component is a root component, set the isRendered flag to true, because it will be rendered only once.
			if (this.isRootComponent) {
				this.isRendered = true;
			}

			this.cachedContainer?.remove();
		}
	}

	destroy() {
		if (this.renderTimeout) {
			clearTimeout(this.renderTimeout);
		}

		if (this.cachedRoot) {
			this.cachedRoot.unmount();
		}

		this.isRendered = false;
		this.cachedContainer = null;
		this.cachedRoot = null;

		// Clean up observer when done
		this.observer.disconnect();
	}
}
