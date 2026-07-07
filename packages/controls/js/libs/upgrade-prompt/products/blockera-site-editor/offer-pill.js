// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { componentInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { SITE_EDITOR_OFFER_URL } from './defaults';

export function SiteEditorOfferPill(): MixedElement {
	return (
		<a
			className={componentInnerClassNames('upgrade-prompt-offer-pill')}
			href={SITE_EDITOR_OFFER_URL}
			target="_blank"
			rel="noreferrer"
			onClick={(e) => {
				e.stopPropagation();
			}}
		>
			<Icon icon="tag" library="wp" iconSize="20" />

			<span>{__('Limited offer: get 15% OFF', 'blockera')}</span>
		</a>
	);
}
