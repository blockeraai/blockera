// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useState, createContext } from '@wordpress/element';
import { isRTL } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { TabPanel } from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { TabsProps } from './types';

export * from './components';

export const TabsContext: {
	Provider: Object,
	Consumer: Object,
	displayName?: string | void,
} = createContext({
	settings: {},
	setSettings: (): void => {},
	hasUpdate: false,
	setHasUpdates: (): void => {},
});

export const Tabs = ({
	items,
	getPanel,
	settings,
	onSelect,
	activeTab,
	setSettings,
	injectMenuEnd,
	heading,
}: {
	settings: Object,
	activeTab: string,
	heading?: string,
	items: Array<TabsProps>,
	onSelect: (tabKey: string) => void,
	getPanel: (tab: TabsProps) => MixedElement,
	setSettings: (newSettings: Object) => void,
	injectMenuEnd?: any,
}): MixedElement => {
	const [hasUpdate, setHasUpdates] = useState(false);

	return (
		<TabsContext.Provider
			value={{ settings, setSettings, hasUpdate, setHasUpdates }}
		>
			<TabPanel
				tabs={items}
				className={'blockera-settings-tabs'}
				initialTabName={activeTab}
				injectMenuEnd={injectMenuEnd}
				heading={heading}
				onSelect={onSelect}
				design="default"
				orientation="vertical"
				activeIcon={
					<Icon
						icon={isRTL() ? 'chevron-left' : 'chevron-right'}
						library="wp"
						iconSize="18"
					/>
				}
			>
				{(tab) => getPanel(tab)}
			</TabPanel>
		</TabsContext.Provider>
	);
};
