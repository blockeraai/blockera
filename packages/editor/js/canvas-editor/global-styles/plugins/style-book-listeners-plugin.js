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
import { styleBookListener, styleBookSelector } from '../style-book-listener';
import { IntersectionObserverRenderer } from '../../intersection-observer-renderer';

/**
 * Plugin: Blockera Style Book Example Listeners
 * Sets up style book listener using intersection observer.
 */
export const registerStyleBookListenersPlugin = (): void => {
	const blockTypes = getBlockTypes();

	registerPlugin('blockera-style-book-example-listeners', {
		render() {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			useEffect(() => {
				new IntersectionObserverRenderer(styleBookSelector, null, {
					callback: () => styleBookListener(blockTypes),
				});
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, []);

			return <></>;
		},
	});
};
