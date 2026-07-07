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
	whenBodyHasClassname: string;
	componentSelector: string;
	observeRootSelector: string;
	observedAncestor: HTMLElement | Document | Element | null;
	Component: null | ComponentType<any>;
	targetElementIsRoot: boolean;
	callback: Function;
	onShouldNotRenderer: boolean | Function;
	isRootComponent: boolean;
	isRendered: boolean;
	clickedBlock: boolean;
	cachedRoot: any;
	cachedContainer: HTMLElement | null;
	renderTimeout: TimeoutID | null;
	mutationFlushRaf: AnimationFrameID | null;
	mutationAccumulationScratch: MutationRecord[];
	hasSideEffectHandlers: boolean;
	skipMutationHandling: boolean;

	constructor(
		targetSelector: string,
		Component: ComponentType<any> | null,
		{
			whileNotExistSelectors = [],
			whenBodyHasClassname = '',
			componentSelector = '',
			observeRootSelector = '',
			callback = null,
			targetElementIsRoot = false,
			onShouldNotRenderer = false,
			isRootComponent = false,
		}: {
			callback?: Function,
			root?: string,
			whenBodyHasClassname?: string,
			componentSelector?: string,
			observeRootSelector?: string,
			whileNotExistSelectors?: string[],
			targetElementIsRoot?: boolean,
			onShouldNotRenderer?: boolean | Function,
			isRootComponent?: any,
		} = {}
	) {
		this.whileNotExistSelectors = whileNotExistSelectors;
		this.whenBodyHasClassname = whenBodyHasClassname;
		this.componentSelector = componentSelector;
		this.observeRootSelector =
			typeof observeRootSelector === 'string' ? observeRootSelector : '';
		this.observedAncestor = null;
		this.targetSelector = targetSelector;
		this.Component = Component;
		this.callback = callback;
		this.targetElementIsRoot = targetElementIsRoot;
		this.onShouldNotRenderer = onShouldNotRenderer;
		this.isRootComponent = isRootComponent;
		this.isRendered = false;
		this.clickedBlock = false;
		this.cachedRoot = null;
		this.cachedContainer = null;
		this.renderTimeout = null;
		this.mutationFlushRaf = null;
		this.mutationAccumulationScratch = [];
		this.hasSideEffectHandlers =
			typeof callback === 'function' ||
			typeof onShouldNotRenderer === 'function';
		this.skipMutationHandling = false;

		// Create mutation observer to watch DOM changes
		this.observer = new MutationObserver((mutations) => {
			this.queueDomChanges(mutations);
		});

		// Start observing
		this.startObserving();

		// Initial render
		this.renderComponent();
	}

	resolveObserveTarget(): HTMLElement | Document | null {
		if (this.observeRootSelector.trim()) {
			const narrowed = document.querySelector(this.observeRootSelector);
			if (narrowed) {
				return narrowed;
			}
		}
		return document.body ?? document.documentElement ?? (null: null);
	}

	queueDomChanges(mutations: MutationRecord[]) {
		if (this.maybeSkipPassiveMutationHandling()) {
			return;
		}

		if (mutations.length === 0) {
			return;
		}

		const root = this.observedAncestor;
		let relevant = mutations;

		if (root instanceof Element || root instanceof Document) {
			relevant = mutations.filter((mutation) => {
				const t = mutation.target;
				return t instanceof Node && root.contains(t);
			});
		} else if (!(root instanceof Node)) {
			return;
		}

		if (relevant.length === 0) {
			return;
		}

		this.mutationAccumulationScratch.push(...relevant);

		if (this.mutationFlushRaf !== null) {
			return;
		}

		this.mutationFlushRaf = requestAnimationFrame(() => {
			this.mutationFlushRaf = null;
			const accumulated = this.mutationAccumulationScratch;
			this.mutationAccumulationScratch = [];
			this.handleDomChanges(accumulated);
		});
	}

	maybeSkipPassiveMutationHandling(): boolean {
		if (this.skipMutationHandling) {
			return true;
		}

		const passiveRenderedRoot =
			this.isRootComponent &&
			this.isRendered &&
			!this.hasSideEffectHandlers;

		if (!passiveRenderedRoot) {
			return false;
		}

		const isIframeCanvasTarget = this.targetSelector.trim() === 'iframe';

		if (!isIframeCanvasTarget) {
			this.skipMutationHandling = true;
			try {
				this.observer.disconnect();
			} catch (_e) {
				//
			}
		}

		return true;
	}

	startObserving() {
		const observeTarget = this.resolveObserveTarget();
		if (!(observeTarget instanceof Node)) {
			return;
		}

		try {
			this.observer.observe(observeTarget, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ['value'],
			});
			this.observedAncestor = observeTarget;
		} catch (_err) {
			//
		}
	}

	mutationTouchesTargetSubtree(node: Element): boolean {
		if (node.matches(this.targetSelector)) {
			return true;
		}

		if (this.targetSelector.trim() === 'iframe') {
			return (
				node.tagName === 'IFRAME' ||
				node.getElementsByTagName('iframe').length > 0
			);
		}

		return node.querySelector(this.targetSelector) !== null;
	}

	handleDomChanges(mutations: MutationRecord[]) {
		if (this.maybeSkipPassiveMutationHandling()) {
			return;
		}

		// Check if our target element was added or removed
		const shouldRerender = mutations.some((mutation) => {
			const addedNodes = Array.from(mutation.addedNodes);
			const removedNodes = Array.from(mutation.removedNodes);

			const nodeChanged = [...addedNodes, ...removedNodes].some(
				(node) => {
					if (node instanceof Element) {
						return this.mutationTouchesTargetSubtree(node);
					}
					return false;
				}
			);

			const attrChanged =
				mutation.type === 'attributes' &&
				mutation.target instanceof Element &&
				mutation.target.matches(this.targetSelector);

			const relevant = nodeChanged || attrChanged;

			if (
				relevant &&
				this.targetElementIsRoot &&
				this.cachedRoot &&
				this.cachedContainer
			) {
				this.cachedRoot = null;
				this.cachedContainer = null;
			}

			return relevant;
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
		if (this.isRendered) {
			return;
		}

		const targetElement = document.querySelector(this.targetSelector);

		if (targetElement && !document.querySelector(this.componentSelector)) {
			if (this.whileNotExistSelectors.length > 0) {
				const shouldRender = this.whileNotExistSelectors.every(
					(selector) => !document.querySelector(selector)
				);

				if (
					!shouldRender ||
					!document.body?.classList?.contains(
						this.whenBodyHasClassname
					)
				) {
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
		if (this.mutationFlushRaf !== null) {
			cancelAnimationFrame(this.mutationFlushRaf);
			this.mutationFlushRaf = null;
		}

		if (this.renderTimeout) {
			clearTimeout(this.renderTimeout);
		}

		if (this.cachedRoot) {
			this.cachedRoot.unmount();
		}

		this.isRendered = false;
		this.clickedBlock = false;
		this.cachedContainer = null;
		this.cachedRoot = null;
		this.skipMutationHandling = false;
		this.mutationAccumulationScratch = [];

		// Clean up observer when done
		this.observer.disconnect();
	}
}
