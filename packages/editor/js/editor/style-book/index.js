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
import { styleBookListener, styleBookSelector } from './style-book-listener';
import { IntersectionObserverRenderer } from '../intersection-observer-renderer';

/**
 * Plugin: Blockera Style Book Example Listeners
 * Sets up style book listener using intersection observer.
 */
export default function StyleBook(): MixedElement {
	const blockTypes = getBlockTypes();

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		new IntersectionObserverRenderer(styleBookSelector, null, {
			callback: () => styleBookListener(blockTypes),
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <></>;
}
