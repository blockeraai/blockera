// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { controlInnerClassNames } from '@blockera/classnames';

export const Preview = (): MixedElement => {
	const previewElement: HTMLElement | null = document.querySelector(
		'a[aria-label="View Post"]'
	);
	const { getEntity } = select('blockera/data');
	const { url: siteURL } = getEntity('site');

	return (
		<a
			href={
				(previewElement && previewElement.getAttribute('href')) ||
				siteURL
			}
			target={'_blank'}
			rel="noreferrer"
			className={controlInnerClassNames('canvas-editor-preview-link')}
		>
			<Icon
				className={'blockera-canvas-preview-link'}
				library={'wp'}
				icon={'external'}
			/>
		</a>
	);
};
