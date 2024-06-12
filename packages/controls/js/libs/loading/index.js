// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

export const LoadingComponent = (): MixedElement => (
	<span>{__('Loading …', 'blockera')}</span>
);
