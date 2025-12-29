// @flow

/**
 * External dependencies
 */
import { useEffect } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal dependencies
 */
import { BlockGlobalStylesPanelScreen } from '../../components';
import { IntersectionObserverRenderer } from '../../intersection-observer-renderer';

/**
 * Plugin: Blockera Global Styles Panel Screen
 * Renders the main panel screen component using intersection observer.
 *
 * @param {string} screen - CSS selector for the screen element
 * @param {string} blocksButton - CSS selector for blocks button
 * @param {string} globalStylesScreen - CSS selector for global styles screen
 * @param {string} blockScreenListItem - CSS selector for block screen list item
 */
export const registerPanelScreenPlugin = (
	screen: string,
	blocksButton: string,
	globalStylesScreen: string,
	blockScreenListItem: string
): void => {
	registerPlugin('blockera-global-styles-panel-screen', {
		render() {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			useEffect(() => {
				new IntersectionObserverRenderer(
					screen,
					() => <BlockGlobalStylesPanelScreen screen={screen} />,
					{
						targetElementIsRoot: true,
						whileNotExistSelectors: [
							blocksButton,
							globalStylesScreen,
							blockScreenListItem,
						],
						componentSelector: '.blockera-extensions-wrapper',
					}
				);
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, []);

			return <></>;
		},
	});
};
