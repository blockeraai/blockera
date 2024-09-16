// @flow
import { type MixedElement, useEffect } from 'react';
import { createPortal } from 'react-dom';

export function prependPortal(
	component: MixedElement,
	container: Element
): MixedElement {
	const portalContainer = document.createElement('div');
	portalContainer.classList.add('blockera-block-inspector-controls-wrapper');

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		container.prepend(portalContainer);

		return () => {
			container.removeChild(portalContainer);
		};
	}, [container, portalContainer]);

	return createPortal(component, portalContainer);
}
