// @flow
/**
 * External dependencies
 */
import { isRTL } from '@wordpress/i18n';
import type { MixedElement } from 'react';

export function ArrowIcon(): MixedElement {
	return isRTL() ? (
		<svg
			width="18"
			height="18"
			viewBox="0 0 18 18"
			xmlns="http://www.w3.org/2000/svg"
			style={{ marginRight: 'auto' }}
		>
			<path d="M11.1 4.875L7.80005 9L11.1 13.125L12 12.45L9.30005 9L12 5.625L11.1 4.875Z" />
		</svg>
	) : (
		<svg
			width="18"
			height="18"
			viewBox="0 0 18 18"
			xmlns="http://www.w3.org/2000/svg"
			style={{ marginLeft: 'auto' }}
		>
			<path d="M8.69999 4.875L12 9L8.69999 13.125L7.79999 12.45L10.5 9L7.79999 5.625L8.69999 4.875Z" />
		</svg>
	);
}
