// @flow

/**
 * External dependencies
 */
import { useEffect } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { getBlockTypes } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { AddBlockTypeIcons, sidebarSelector } from '../side-bar-listener';
import { IntersectionObserverRenderer } from '../../intersection-observer-renderer';

/**
 * Plugin: Blockera Sidebar Global Styles Listeners
 * Renders block type icons in the sidebar using intersection observer.
 */
export const registerSidebarListenersPlugin = (): void => {
	const blockTypes = getBlockTypes();

	registerPlugin('blockera-sidebar-global-styles-listeners', {
		render() {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			useEffect(() => {
				new IntersectionObserverRenderer(
					sidebarSelector,
					() => <AddBlockTypeIcons blockTypes={blockTypes} />,
					{
						componentSelector: '.blockera-block-types-icons',
					}
				);
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, []);

			return <></>;
		},
	});
};
