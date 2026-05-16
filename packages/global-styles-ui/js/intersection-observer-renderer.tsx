/**
 * External dependencies
 */
import type { ComponentType } from 'react';
import { createRoot } from '@wordpress/element';

type RendererOptions = {
	whileNotExistSelectors?: string[];
	whenBodyHasClassname?: string;
	componentSelector?: string;
	observeRootSelector?: string;
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
	observeRootSelector: string;
	observedAncestor: HTMLElement | Document | Element | null;
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
	mutationFlushRaf: number | null;
	mutationAccumulationScratch: MutationRecord[];
	hasSideEffectHandlers: boolean;
	skipMutationHandling: boolean;

	constructor(
		targetSelector: string,
		Component: ComponentType<
			RootComponentProps | Record<string, never>
		> | null,
		{
			whileNotExistSelectors = [],
			whenBodyHasClassname = '',
			componentSelector = '',
			observeRootSelector = '',
			callback = null,
			targetElementIsRoot = false,
			onShouldNotRenderer = false,
			isRootComponent = false,
		}: RendererOptions = {}
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
		this.isRootComponent = Boolean(isRootComponent);
		this.clickedBlock = false;
		this.cachedRoot = null;
		this.cachedContainer = null;
		this.renderTimeout = null;
		this.mutationFlushRaf = null;
		this.mutationAccumulationScratch = [];
		this.isRendered = false;
		this.skipMutationHandling = false;
		this.hasSideEffectHandlers =
			typeof callback === 'function' ||
			typeof onShouldNotRenderer === 'function';

		this.observer = new MutationObserver((mutations) => {
			this.queueDomChanges(mutations);
		});

		this.startObserving();
		this.renderComponent();
	}

	resolveObserveTarget(): HTMLElement | Document | null {
		if (this.observeRootSelector.trim()) {
			const narrowed = document.querySelector(this.observeRootSelector);
			if (narrowed) {
				return narrowed;
			}
		}

		return document.body ?? document.documentElement ?? null;
	}

	queueDomChanges(mutations: MutationRecord[]): void {
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
				const { target } = mutation;
				return target instanceof Node && root.contains(target);
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

	startObserving(): void {
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

	handleDomChanges(mutations: MutationRecord[]): void {
		if (this.maybeSkipPassiveMutationHandling()) {
			return;
		}

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

		this.observer.disconnect();
	}
}
