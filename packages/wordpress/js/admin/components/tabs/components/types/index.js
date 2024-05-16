// @flow

/**
 * Blockera dependencies
 */
import type { TTabProps } from '@blockera/components/js/tabs/types';

export type TabsComponentsProps = {
	tab: TTabProps,
	settings: Object,
	description: string,
	setSettings: (settings: Object) => void,
};
