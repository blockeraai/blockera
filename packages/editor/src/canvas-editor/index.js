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
}: {
	entry: IntersectionObserverEntry,
}): MixedElement => {
	const ref = useRef(null);
	const { getSelectedBlock } = select('core/block-editor');
	const selectedBlock = getSelectedBlock();

	const className = 'publisher-core-canvas-breakpoints';

	useEffect(() => {
		ref.current = {
			previewElement: document.querySelector('a[aria-label="View Post"]'),
			dropDownPreview: document.querySelector(
				'div.block-editor-post-preview__dropdown'
			),
		};

		if (ref.current.previewElement) {
			ref.current.previewElement.style.display = 'none';
		}
		if (ref.current.dropDownPreview) {
			ref.current.dropDownPreview.style.display = 'none';
		}
	}, [selectedBlock]);

	if (!ref.current) {
		return <></>;
	}

	return createPortal(<Breakpoints className={className} />, entry.target);
};

export * from './components';
