// @flow
import { type MixedElement } from 'react';
import { createPortal } from 'react-dom';

export function withPrependPortal(
	component: MixedElement,
	container: Element
): MixedElement {
	const portalElement = document.createElement('div');
	container.prepend(portalElement);
	return createPortal(component, portalElement);
}
