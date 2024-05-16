// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import type { PromoteProps } from './types';

export const Promote = ({
	url = '#',
	description,
}: PromoteProps): MixedElement => {
	return (
		<div className={'blockera-settings-promote'}>
			{description}
			<a href={url}>{__('upgrading to Pro', 'blockera')}</a>
		</div>
	);
};
