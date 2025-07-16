// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { createPortal } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { CanvasEditor } from './components';

export const CanvasEditorApplication = ({
	target,
}: {
	target: HTMLElement | null,
}): MixedElement => {
	const className = 'blockera-canvas-breakpoints';

	if (!target) {
		return <></>;
	}

	return createPortal(<CanvasEditor className={className} />, target);
};

export * from './components';
export * from './bootstrap';
