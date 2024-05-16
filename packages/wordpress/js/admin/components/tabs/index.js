// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useEntityRecord } from '@wordpress/core-data';
import { useState, createContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import TabPanel from '@blockera/components/js/tabs/tab-panel';
import type { TTabProps } from '@blockera/components/js/tabs/types';

export * from './components';

export const TabsContext: {
	Provider: Object,
	Consumer: Object,
	displayName?: string | void,
} = createContext({
	settings: {},
	setSettings: (): void => {},
});

export const Tabs = ({
	items,
	getPanel,
	settings,
	onSelect,
	activeTab,
	setSettings,
}: {
	settings: Object,
	activeTab: string,
	items: Array<TTabProps>,
	onSelect: (tabKey: string) => void,
	getPanel: (tab: TTabProps) => MixedElement,
	setSettings: (newSettings: Object) => void,
}): MixedElement => {
	return (
		<TabsContext.Provider value={{ settings, setSettings }}>
			<TabPanel
				tabs={items}
				className={'blockera-settings-tabs'}
				initialTabName={activeTab}
				onSelect={onSelect}
			>
				{(tab) => getPanel(tab)}
			</TabPanel>
		</TabsContext.Provider>
	);
};
