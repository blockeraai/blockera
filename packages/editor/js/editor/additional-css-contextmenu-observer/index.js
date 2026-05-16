// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { type MixedElement } from 'react';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getTargets } from '../header-ui/helpers';
import { IntersectionObserverRenderer } from '../intersection-observer-renderer';

/**
 * Plugin: Blockera Additional CSS Context Menu Observer
 * Observes context menu and redirects clicks to custom CSS button.
 *
 * @param {string} screen - CSS selector for the screen element
 */
export default function AdditionalCssContextmenuObserver(): MixedElement {
	const { getEntity } = select('blockera/data') || {};

	const { version } = getEntity('wp');
	const { globalStylesPanel } = getTargets(version);

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

					if (!document?.querySelector(globalStylesPanel.screen)) {
						return;
					}

					element.addEventListener(
						'click',
						(e) => {
							e.preventDefault();
							e.stopPropagation();

							// Safety guard: ensure custom CSS button exists
							const customCssButton = document.querySelector(
								'.custom-css-button button'
							);

							if (customCssButton) {
								customCssButton.click();
							}
						},
						{ once: true }
					);
				},
			}
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <></>;
}
