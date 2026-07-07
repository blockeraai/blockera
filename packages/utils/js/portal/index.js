// @flow
/**
 * External dependencies
 */
import {
	type MixedElement,
	useLayoutEffect,
	useRef,
	createElement,
} from 'react';
import { createPortal } from 'react-dom';

const WRAPPER_CLASS = 'blockera-block-inspector-controls-wrapper';

const applyPortalClassName = (
	element: HTMLDivElement,
	className: string | Array<string>
): void => {
	element.className = WRAPPER_CLASS;

	if (!className) {
		return;
	}

	if (Array.isArray(className)) {
		className.forEach((cls: string) => {
			element.classList.add(cls);
		});
		return;
	}

	element.classList.add(className);
};

type PrependPortalProps = {
	children: MixedElement,
	container: ?Element,
	className?: string | Array<string>,
};

/**
 * Prepends children into a DOM container via a portal host element.
 * Hooks always run (even when container is not ready yet).
 */
export function PrependPortal({
	children,
	container,
	className = '',
}: PrependPortalProps): MixedElement | null {
	const portalHostRef = useRef<?HTMLDivElement>(null);

	if (!portalHostRef.current) {
		portalHostRef.current = document.createElement('div');
	}

	const portalHost = portalHostRef.current;

	// Keep wrapper classes current before layout effects run (detached host).
	applyPortalClassName(portalHost, className);

	useLayoutEffect(() => {
		if (!container) {
			return;
		}

		const attachPortalHost = () => {
			if (!document.contains(container)) {
				return;
			}

			applyPortalClassName(portalHost, className);

			if (!container.contains(portalHost)) {
				container.prepend(portalHost);
			}
		};

		attachPortalHost();

		const observer = new MutationObserver(attachPortalHost);

		observer.observe(container, {
			childList: true,
		});

		return () => {
			observer.disconnect();

			if (container.contains(portalHost)) {
				container.removeChild(portalHost);
			}
		};
	}, [container, portalHost, className]);

	if (!container) {
		return null;
	}

	return createPortal(children, portalHost);
}

export function prependPortal(
	component: MixedElement,
	container: ?Element,
	props: Object = {}
): MixedElement {
	return createElement(PrependPortal, {
		container,
		className: props.className,
		children: component,
	});
}
