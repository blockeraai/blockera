// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import domReady from '@wordpress/dom-ready';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { noop } from '@blockera/utils';

export const initializer = (): void => {
	const bootstrap = applyFilters('blockera.bootstrapper', noop);

	if ('function' !== typeof bootstrap) {
		console.warn(
			__(
				'bootstrap constant is not function! please provide bootstrap function.',
				'blockera'
			)
		);

		return;
	}

	bootstrap();

	return domReady(applyFilters('blockera.bootstrapper.domReady', noop));
};
