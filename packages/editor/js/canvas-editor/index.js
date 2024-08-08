// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { useRef, useEffect, createPortal } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { Breakpoints } from './components';

export const CanvasEditor = ({
	entry,
	previewDropdown,
	postPreviewElement,
}: {
	previewDropdown: string,
	postPreviewElement: string,
	entry: IntersectionObserverEntry,
}): MixedElement => {
	const ref = useRef(null);
	const { getSelectedBlock } = select('core/block-editor');
	const selectedBlock = getSelectedBlock();

	const className = 'blockera-canvas-breakpoints';

	useEffect(() => {
		ref.current = {
			postPreviewElement: document.querySelector(postPreviewElement),
			previewDropdown: document.querySelector(previewDropdown),
		};

		if (ref.current.postPreviewElement) {
			ref.current.postPreviewElement.style.display = 'none';
		}
		if (ref.current.previewDropdown) {
			ref.current.previewDropdown.style.display = 'none';
		}
	}, [selectedBlock]);

	return createPortal(<Breakpoints className={className} />, entry.target);
};

export * from './components';
export * from './bootstrap';
