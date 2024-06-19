// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import { Icon } from '@blockera/icons';

export const LoadingComponent = (): MixedElement => (
	<span>
		<Icon library="blockera" icon="blockera-cube" iconSize="18" />
		{__('Loading …', 'blockera')}
	</span>
);
