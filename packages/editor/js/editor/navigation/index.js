// @flow

/**
 * External dependencies
 */
import { type MixedElement } from 'react';
import { useEffect, createPortal } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BlockeraGlobalStylesNavigation } from './blockera-global-styles-navigation';
import { IntersectionObserverRenderer } from '../global-styles/intersection-observer-renderer';

/**
 * Plugin: Blockera Global Styles Navigation
 * Renders navigation component for global styles screen using intersection observer.
 */
export default function GlobalStylesNavigation({
	className,
}: {
	className: string,
}): MixedElement {
	useEffect(() => {
		new IntersectionObserverRenderer(
			'.edit-site-global-styles-screen-root__active-style-tile',
			() => {
				// Safety guard: ensure target element exists before creating portal
				const targetElement = document.querySelector(
					'.edit-site-global-styles-screen-root__active-style-tile'
				);

				if (!targetElement?.parentElement) {
					return null;
				}

				return createPortal(
					<BlockeraGlobalStylesNavigation className={className} />,
					targetElement.parentElement
				);
			},
			{
				isRootComponent: true,
				targetElementIsRoot: true,
				componentSelector: '.blockera-styles-navigation',
			}
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <></>;
}
