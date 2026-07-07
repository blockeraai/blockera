// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { type MixedElement } from 'react';
import { useEffect, createPortal } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { getGlobalStylesPanelSelectors } from '@blockera/global-styles-ui';

/**
 * Internal dependencies
 */
import { IntersectionObserverRenderer } from '../intersection-observer-renderer';
import { BlockeraGlobalStylesNavigation } from './blockera-global-styles-navigation';

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
		const { getEntity } = select('blockera/data') || {};
		const { version } = getEntity?.('wp') || {};
		const { activeStyleTile } = getGlobalStylesPanelSelectors(
			version || ''
		);

		new IntersectionObserverRenderer(
			activeStyleTile,
			() => {
				const targetElement = document.querySelector(activeStyleTile);

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
