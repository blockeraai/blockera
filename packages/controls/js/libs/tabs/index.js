// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import TabPanel from './tab-panel';
import type { TTabsProps, TTabProps } from './types';

/**
 * Handle on select event!
 *
 * @param {string} tabName the name of tab
 * @param {Function} setCurrentTab the set current tab to block high level state.
 */
const onSelect = (
	tabName: string,
	setCurrentTab?: (tabName: string) => void
): void =>
	'function' === typeof setCurrentTab ? setCurrentTab(tabName) : undefined;

export function Tabs({
	activeTab,
	tabs,
	getPanel,
	design,
	orientation,
	setCurrentTab,
	className,
}: TTabsProps): Element<any> {
	const tabsRef: {
		current: Array<{
			...TTabProps,
			icon?: Element<any>,
			settingSlug?: string,
		}>,
	} = useRef(tabs);
	const ref = useRef();

	return (
		<div ref={ref}>
			<TabPanel
				activeClass="is-active-tab"
				onSelect={(tabName) => {
					onSelect(tabName, setCurrentTab);
				}}
				tabs={tabsRef.current}
				initialTabName={activeTab}
				design={design}
				orientation={orientation}
				className={className}
			>
				{(tab) => getPanel(tab)}
			</TabPanel>
		</div>
	);
}

export { default as TabPanel } from './tab-panel';
export default Tabs;
