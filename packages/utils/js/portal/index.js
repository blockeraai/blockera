// @flow
import { type MixedElement, useEffect } from 'react';
import { createPortal } from 'react-dom';

export function prependPortal(
	component: MixedElement,
	container: Element,
	props: Object = {}
): MixedElement {
	const { className = '' } = props;

	const portalContainer = document.createElement('div');
	portalContainer.classList.add('blockera-block-inspector-controls-wrapper');

	if (className) {
		if (Array.isArray(className)) {
			className.forEach((cls) => {
				portalContainer.classList.add(cls);
			});
		} else {
			portalContainer.classList.add(className);
		}
	}

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		container.prepend(portalContainer);

		return () => {
			container.removeChild(portalContainer);
		};
	}, [container, portalContainer]);

	return createPortal(component, portalContainer);
}
