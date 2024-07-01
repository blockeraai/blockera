// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Button } from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { PromoteProps } from './types';

export const Promote = ({
	url = '#',
	description,
}: PromoteProps): MixedElement => {
	return (
		<div className={'blockera-settings-promote'}>
			{description}
			<Button
				href={url}
				variant={'link'}
				className={'blockera-promote-link'}
				text={__('upgrading to Pro', 'blockera')}
			/>
		</div>
	);
};
