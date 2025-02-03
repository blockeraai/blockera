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
	target,
	previewDropdown,
	postPreviewElement,
}: {
	previewDropdown: string,
	postPreviewElement: string,
	target: HTMLElement | null,
}): MixedElement => {
	const ref = useRef(null);
	const { getSelectedBlock } = select('core/block-editor');
	const selectedBlock = getSelectedBlock();

	const className = 'blockera-canvas-breakpoints';

	useEffect(() => {
		ref.current = {
			postPreviewElement: document.querySelector(postPreviewElement),
			previewDropdown: document.querySelectorAll(previewDropdown),
		};

		if (ref.current.postPreviewElement) {
			ref.current.postPreviewElement.style.display = 'none';
		}
		if (ref.current.previewDropdown.length) {
			ref.current.previewDropdown.forEach((previewElement) => {
				if (previewElement) {
					previewElement.style.display = 'none';
				}
			});
		}
		// eslint-disable-next-line
	}, [selectedBlock]);

	if (!target) {
		return <></>;
	}

	return createPortal(<Breakpoints className={className} />, target);
};

export * from './components';
export * from './bootstrap';
