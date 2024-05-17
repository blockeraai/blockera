// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import type { TTabProps } from '@blockera/components/js/tabs/types';

export type TabsComponentsProps = {
	tab: TTabProps,
	settings: Object,
	description: MixedElement,
	setSettings: (settings: Object) => void,
};
