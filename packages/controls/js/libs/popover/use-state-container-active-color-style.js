// @flow

/**
 * External dependencies
 */
import { useState, useEffect } from '@wordpress/element';

const BLOCKERA_ACTIVE_COLOR_CSS_PROPERTIES = [
	'--blockera-controls-primary-color',
	'--blockera-tab-panel-active-color',
	'--blockera-controls-variations-color',
	'--blockera-controls-variations-color-bk',
	'--blockera-controls-variations-color-darker-20',
];

const GLOBAL_STYLES_PANEL_STACK_SELECTOR =
	'.blockera-global-styles-panel-stack';
const GLOBAL_STYLES_SIZE_ASIDE_SELECTOR = '.blockera-global-styles-panel-aside';
const INSPECTOR_ROOT_SELECTOR = '.block-editor-block-inspector';

/**
 * Style-variation surface root inside a dual-stack panel (first non-aside child).
 *
 * @param {HTMLElement} stack Global-styles panel stack element.
 * @return {HTMLElement} Root element for the style variation surface.
 */
export function getStyleVariationStackRoot(stack: HTMLElement): HTMLElement {
	for (let index = 0; index < stack.children.length; index++) {
		const child = stack.children[index];

		if (!child.classList.contains('blockera-global-styles-panel-aside')) {
			return child;
		}
	}

	return stack;
}

/**
 * Scope element for a global-styles anchor (style stack vs size aside).
 *
 * @param {HTMLElement} stack Global-styles panel stack element.
 * @param {HTMLElement} anchor Popover anchor element.
 * @return {HTMLElement} Surface scope that owns the anchor.
 */
export function getGlobalStylesSurfaceScopeForAnchor(
	stack: HTMLElement,
	anchor: HTMLElement
): HTMLElement {
	const sizeAside = stack.querySelector(GLOBAL_STYLES_SIZE_ASIDE_SELECTOR);

	if (sizeAside && sizeAside.contains(anchor)) {
		return sizeAside;
	}

	return getStyleVariationStackRoot(stack);
}

/**
 * Prefer the innermost StateContainer — nested inner-block cards sit inside the
 * active surface scope and must win over master/variation wrappers.
 *
 * @param {HTMLElement|null|undefined} root Surface or inspector root element.
 * @return {HTMLElement|null} Deepest matching StateContainer, if any.
 */
export function getInnermostStateColorsContainer(
	root: HTMLElement | null | void
): HTMLElement | null {
	if (!root) {
		return null;
	}

	const containers = root.querySelectorAll(
		'.blockera-state-colors-container'
	);

	if (!containers.length) {
		return null;
	}

	return containers[containers.length - 1];
}

/**
 * Resolve the StateContainer that should drive portaled popover colors.
 *
 * @param {HTMLElement|null|undefined} anchor Popover anchor in the panel DOM.
 * @return {HTMLElement|null} Matching StateContainer for the anchor scope.
 */
export function findActiveStateColorsContainer(
	anchor?: HTMLElement | null
): HTMLElement | null {
	if (anchor) {
		const stack = anchor.closest(GLOBAL_STYLES_PANEL_STACK_SELECTOR);

		if (stack instanceof HTMLElement) {
			return getInnermostStateColorsContainer(
				getGlobalStylesSurfaceScopeForAnchor(stack, anchor)
			);
		}

		const inspector = anchor.closest(INSPECTOR_ROOT_SELECTOR);

		if (inspector instanceof HTMLElement) {
			return getInnermostStateColorsContainer(inspector);
		}
	}

	const stack = document.querySelector(GLOBAL_STYLES_PANEL_STACK_SELECTOR);

	if (stack instanceof HTMLElement) {
		const sizeAside = stack.querySelector(
			GLOBAL_STYLES_SIZE_ASIDE_SELECTOR
		);

		if (sizeAside) {
			return (
				getInnermostStateColorsContainer(
					getStyleVariationStackRoot(stack)
				) ||
				getInnermostStateColorsContainer(sizeAside) ||
				getInnermostStateColorsContainer(stack)
			);
		}

		return getInnermostStateColorsContainer(stack);
	}

	return (
		getInnermostStateColorsContainer(
			document.querySelector(INSPECTOR_ROOT_SELECTOR)
		) || document.querySelector('.blockera-state-colors-container')
	);
}

/**
 * Read Blockera active color CSS variables from StateContainer inline styles.
 *
 * @param {HTMLElement|null|undefined} container StateContainer element.
 * @return {Object} React-compatible style object for popover roots.
 */
export function getStateContainerActiveColorStyle(
	container: HTMLElement | null | void
): Object {
	if (!container) {
		return {};
	}

	const computed = getComputedStyle(container);
	const style: Object = {
		color: 'inherit',
	};

	BLOCKERA_ACTIVE_COLOR_CSS_PROPERTIES.forEach((propertyName) => {
		const value = computed.getPropertyValue(propertyName).trim();

		if (value) {
			style[propertyName] = value;
		}
	});

	return style;
}

/**
 * Keep portaled popovers in sync with the active StateContainer color tokens.
 *
 * @param {HTMLElement|null|undefined} anchor Popover anchor in the panel DOM.
 * @return {Object} React style object for popover roots.
 */
export function useStateContainerActiveColorStyle(
	anchor?: HTMLElement | null
): Object {
	const [style, setStyle] = useState(() =>
		getStateContainerActiveColorStyle(
			findActiveStateColorsContainer(anchor)
		)
	);

	useEffect(() => {
		const sync = () => {
			setStyle(
				getStateContainerActiveColorStyle(
					findActiveStateColorsContainer(anchor)
				)
			);
		};

		sync();

		const observeRoots = [
			document.querySelector(GLOBAL_STYLES_PANEL_STACK_SELECTOR),
			document.querySelector(INSPECTOR_ROOT_SELECTOR),
		].filter(Boolean);

		const observers = observeRoots.map((root) => {
			const observer = new MutationObserver(sync);

			observer.observe(root, {
				attributes: true,
				attributeFilter: ['style', 'class'],
				subtree: true,
				childList: true,
			});

			return observer;
		});

		return () => {
			observers.forEach((observer) => {
				observer.disconnect();
			});
		};
	}, [anchor]);

	return style;
}
