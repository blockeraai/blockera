// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { createPortal } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { Breakpoints } from './components';

export const CanvasEditor = ({
	target,
}: {
	target: HTMLElement | null,
}): MixedElement => {
	const className = 'blockera-canvas-breakpoints';

	if (!target) {
		return <></>;
	}

	return createPortal(<Breakpoints className={className} />, target);
};

export * from './components';
export * from './bootstrap';
