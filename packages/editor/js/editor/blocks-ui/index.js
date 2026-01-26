// @flow

/**
 * External dependencies
 */
import { type MixedElement } from 'react';
import { useEffect } from '@wordpress/element';
import { getBlockTypes } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import {
	AddBlockTypeIcons,
	sidebarSelector,
} from '../global-styles-actions-for-blocks/side-bar-listener';
import { IntersectionObserverRenderer } from '../global-styles/intersection-observer-renderer';

/**
 * Plugin: Blockera Sidebar Global Styles Listeners
 * Renders block type icons in the sidebar using intersection observer.
 */
export default function BlocksUI(): MixedElement {
	const blockTypes = getBlockTypes();

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
}
