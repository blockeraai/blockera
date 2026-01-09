// @flow

/**
 * External dependencies
 */
import { registerPlugin } from '@wordpress/plugins';
import { useEffect, createPortal } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BlockeraGlobalStylesNavigation } from '../../../components';
import { IntersectionObserverRenderer } from '../../../intersection-observer-renderer';

/**
 * Plugin: Blockera Global Styles Navigation
 * Renders navigation component for global styles screen using intersection observer.
 */
export const registerNavigationPlugin = (): void => {
	registerPlugin('blockera-global-styles-navigation', {
		render() {
			// eslint-disable-next-line react-hooks/rules-of-hooks
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
							<BlockeraGlobalStylesNavigation />,
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
		},
	});
};
