// @flow

/**
 * External dependencies
 */
import { useEffect } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal dependencies
 */
import { IntersectionObserverRenderer } from '../../intersection-observer-renderer';

/**
 * Plugin: Blockera Additional CSS Context Menu Observer
 * Observes context menu and redirects clicks to custom CSS button.
 *
 * @param {string} screen - CSS selector for the screen element
 */
export const registerAdditionalCssContextmenuObserverPlugin = (
	screen: string
): void => {
	registerPlugin('blockera-additional-css-contextmenu-observer', {
		render() {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			useEffect(() => {
				new IntersectionObserverRenderer(
					'.components-popover__content button:first-child',
					null,
					{
						callback: () => {
							const element = document.querySelector(
								'.components-popover__content button:first-child'
							);

							// Safety guard: ensure element and screen exist
							if (!element) {
								return;
							}

							if (!document.querySelector(screen)) {
								return;
							}

							element.addEventListener('click', (e) => {
								e.preventDefault();
								e.stopPropagation();

								// Safety guard: ensure custom CSS button exists
								const customCssButton = document.querySelector(
									'.custom-css-button button'
								);

								if (customCssButton) {
									customCssButton.click();
								}
							});
						},
					}
				);
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, []);

			return <></>;
		},
	});
};
