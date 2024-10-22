// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useEffect } from '@wordpress/element';

export const BlockApp = ({ children, onClick }: Object): MixedElement => {
	useEffect(() => {
		// Add event listener to the document
		document.addEventListener('click', onClick);

		// Clean up the event listener on unmount
		return () => {
			document.removeEventListener('click', onClick);
		};
	}, [onClick]);

	return <>{children}</>;
};
