// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { TabsComponentsProps } from '@blockera/wordpress';

export const LicenseManagerPanel = (
	// eslint-disable-next-line
	{
		// eslint-disable-next-line
		tab,
		// eslint-disable-next-line
		settings,
		// eslint-disable-next-line
		description,
		// eslint-disable-next-line
		setSettings,
	}: TabsComponentsProps
): MixedElement => {
	return <>{__('Coming soon…', 'blockera')}</>;
};
