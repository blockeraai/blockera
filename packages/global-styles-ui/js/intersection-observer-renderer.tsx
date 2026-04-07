/**
 * External dependencies
 */
import type { ComponentType } from 'react';
import { createRoot } from '@wordpress/element';
type RendererOptions = {
	whileNotExistSelectors?: string[];
	whenBodyHasClassname?: string;
	componentSelector?: string;
	callback?: () => void;
	targetElementIsRoot?: boolean;
	onShouldNotRenderer?: (() => void) | boolean;
	isRootComponent?: boolean;
};

type RootComponentProps = { clickedBlock?: boolean };

export class IntersectionObserverRenderer {
	observer: MutationObserver;
	targetSelector: string;
	whileNotExistSelectors: string[];
	whenBodyHasClassname: string;
	componentSelector: string;
	Component: null | ComponentType<RootComponentProps | Record<string, never>>;
	targetElementIsRoot: boolean;
	callback: (() => void) | null;
	onShouldNotRenderer: (() => void) | boolean;
	isRootComponent: boolean;
	isRendered: boolean;
	clickedBlock: boolean;
	cachedRoot: ReturnType<typeof createRoot> | null;
	cachedContainer: HTMLElement | null;
	renderTimeout: ReturnType<typeof setTimeout> | null;

	constructor(
		targetSelector: string,
		Component: ComponentType<
			RootComponentProps | Record<string, never>
		> | null,
		{
			whileNotExistSelectors = [],
			whenBodyHasClassname = '',
			componentSelector = '',
			callback = null,
			targetElementIsRoot = false,
			onShouldNotRenderer = false,
			isRootComponent = false,
		}: RendererOptions = {}
	) {
		this.whileNotExistSelectors = whileNotExistSelectors;
		this.whenBodyHasClassname = whenBodyHasClassname;
		this.componentSelector = componentSelector;
		this.targetSelector = targetSelector;
		this.Component = Component;
		this.callback = callback;
		this.targetElementIsRoot = targetElementIsRoot;
		this.onShouldNotRenderer = onShouldNotRenderer;
		this.isRootComponent = Boolean(isRootComponent);
		this.clickedBlock = false;
		this.cachedRoot = null;
		this.cachedContainer = null;
		this.renderTimeout = null;
		this.isRendered = false;

		this.observer = new MutationObserver((mutations) => {
			this.handleDomChanges(mutations);
		});

		this.startObserving();
		this.renderComponent();
	}

	startObserving(): void {
		if (document.body) {
			this.observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ['value'],
			});
		}
	}

	handleDomChanges(mutations: MutationRecord[]): void {
		const shouldRerender = mutations.some((mutation) => {
			const addedNodes = Array.from(mutation.addedNodes);
			const removedNodes = Array.from(mutation.removedNodes);

			const nodeChanged = [...addedNodes, ...removedNodes].some(
				(node) => {
					if (node instanceof Element) {
						return (
							node.matches(this.targetSelector) ||
							!!node.querySelector(this.targetSelector)
						);
					}
					return false;
				}
			);

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
			if (this.renderTimeout) {
				clearTimeout(this.renderTimeout);
			}
			this.renderTimeout = setTimeout(() => {
				this.renderComponent();
			}, 100);
		}

		if (typeof this.callback === 'function') {
			this.callback();
		}

		if (!shouldRerender && typeof this.onShouldNotRenderer === 'function') {
			this.onShouldNotRenderer();
		}
	}

	renderComponent(): void {
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
				if (!(targetElement instanceof Element)) {
					return;
				}

				if (!this.cachedContainer) {
					this.cachedContainer = document.createElement('div');
					this.cachedRoot = createRoot(this.cachedContainer);
				}

				const Comp = this.Component;
				if (Comp && this.cachedRoot) {
					this.cachedRoot.render(
						<Comp clickedBlock={this.clickedBlock} />
					);
				}

				if (
					targetElement.tagName === 'IFRAME' &&
					(targetElement as HTMLIFrameElement).contentDocument?.body
				) {
					(
						targetElement as HTMLIFrameElement
					).contentDocument.body.appendChild(this.cachedContainer);

					if (this.isRootComponent) {
						this.isRendered = true;
					}
				}

				return;
			}

			if (!this.cachedContainer) {
				this.cachedContainer = document.createElement('div');
				this.cachedRoot = createRoot(this.cachedContainer);
			}

			if (this.cachedContainer) {
				targetElement.appendChild(this.cachedContainer);
			}

			const CompFlat = this.Component;
			if (CompFlat && this.cachedRoot) {
				this.cachedRoot.render(<CompFlat />);
			}

			if (this.isRootComponent) {
				this.isRendered = true;
			}

			this.cachedContainer?.remove();
		}
	}

	destroy(): void {
		if (this.renderTimeout) {
			clearTimeout(this.renderTimeout);
		}

		if (this.cachedRoot) {
			this.cachedRoot.unmount();
		}

		this.isRendered = false;
		this.cachedContainer = null;
		this.cachedRoot = null;

		this.observer.disconnect();
	}
}
