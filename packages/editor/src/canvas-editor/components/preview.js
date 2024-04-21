// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/components';

export const Preview = (): MixedElement => {
	const previewElement: HTMLElement | null = document.querySelector(
		'a[aria-label="View Post"]'
	);
	const { getEntity } = select('blockera-core/data');
	const { url: siteURL } = getEntity('site');

	return (
		<a
			href={
				(previewElement && previewElement.getAttribute('href')) ||
				siteURL
			}
			target={'_blank'}
			rel="noreferrer"
		>
			<Icon
				className={'blockera-canvas-preview-link'}
				library={'wp'}
				icon={'external'}
			/>
		</a>
	);
};
