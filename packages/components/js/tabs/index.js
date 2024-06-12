// @flow
/**
 * External dependencies
 */
import classnames from 'classnames';
import type { Element } from 'react';
import { useRef } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { useBlockContext } from '@blockera/editor/js/extensions/hooks/context';

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
	setCurrentTab: (tabName: string) => void
): void => setCurrentTab(tabName);

export function Tabs(props: TTabsProps): Element<any> {
	const { activeTab, tabs, getPanel } = props;
	const tabsRef: {
		current: Array<{
			...TTabProps,
			icon: Element<any>,
		}>,
	} = useRef(tabs);
	const ref = useRef();
	const { setCurrentTab } = useBlockContext();
	const classes = classnames('blockera-tab-panel');

	return (
		<div ref={ref}>
			<TabPanel
				className={classes}
				activeClass="active-tab"
				onSelect={(tabName) => {
					onSelect(tabName, setCurrentTab);
				}}
				tabs={tabsRef.current}
				initialTabName={activeTab}
			>
				{(tab) => getPanel(tab)}
			</TabPanel>
		</div>
	);
}

export default Tabs;
