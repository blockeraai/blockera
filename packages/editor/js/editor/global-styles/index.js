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
import { BlockGlobalStylesPanelScreen } from './panel';
import { IntersectionObserverRenderer } from '../intersection-observer-renderer';

/**
 * Plugin: Blockera Global Styles Panel Screen
 * Renders the main panel screen component using intersection observer.
 *
 * @param {string} screen - CSS selector for the screen element
 * @param {string} blocksButton - CSS selector for blocks button
 * @param {string} globalStylesScreen - CSS selector for global styles screen
 * @param {string} blockScreenListItem - CSS selector for block screen list item
 */
export default function GlobalStyles({
	className,
}: {
	className: string,
}): MixedElement {
	const { getEntity } = select('blockera/data') || {};
	const { version } = getEntity('wp');
	const {
		globalStylesPanel: {
			screen,
			blocksButton,
			globalStylesScreen,
			blockScreenListItem,
		},
	} = getTargets(version);
	useEffect(() => {
		new IntersectionObserverRenderer(
			screen,
			() => (
				<BlockGlobalStylesPanelScreen
					screen={screen}
					bodySupportingClassname={className}
				/>
			),
			{
				targetElementIsRoot: true,
				whileNotExistSelectors: [
					blocksButton,
					globalStylesScreen,
					blockScreenListItem,
				],
				whenBodyHasClassname: className,
				componentSelector: '.blockera-extensions-wrapper',
			}
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <></>;
}

export * from './registration';
