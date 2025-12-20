// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { useInstanceId } from '@wordpress/compose';
import { useState, useEffect, useCallback, useRef } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';

/**
 * Internal dependencies
 */
import TabMenu from './tab-menu';
import type { TTabsProps } from './types';

export function Tabs({
	activeTab,
	tabs,
	getPanel,
	design = 'clean',
	orientation = 'horizontal',
	setCurrentTab,
	className,
	activeClass = 'is-active-tab',
	activeIcon,
	injectMenuEnd,
	heading,
}: TTabsProps): Element<any> {
	const ref = useRef();
	const instanceId = useInstanceId(Tabs, 'tab-panel');
	const [selected, setSelected] = useState<?string>(null);

	const handleTabClick = useCallback(
		(tabName: string): void => {
			setSelected(tabName);
			if (typeof setCurrentTab === 'function') {
				setCurrentTab(tabName);
			}
		},
		[setCurrentTab]
	);

	const selectedTab = tabs.find((tab) => tab.name === selected);
	const selectedId = `${instanceId}-${selectedTab?.name ?? 'none'}`;

	useEffect(() => {
		const newSelectedTab = tabs.find((tab) => tab.name === selected);
		if (!newSelectedTab) {
			setSelected(activeTab || (tabs.length > 0 ? tabs[0].name : null));
		}
	}, [activeTab, selected, tabs]);

	return (
		<div
			ref={ref}
			className={componentClassNames(
				'tabs',
				'design-' + design,
				className
			)}
		>
			<TabMenu
				tabs={tabs}
				selected={selected}
				instanceId={instanceId}
				orientation={orientation}
				activeClass={activeClass}
				activeIcon={activeIcon}
				injectMenuEnd={injectMenuEnd}
				heading={heading}
				onTabClick={handleTabClick}
			/>
			{selectedTab && (
				<div
					key={selectedId}
					aria-labelledby={selectedId}
					role="tabpanel"
					id={`${selectedId}-view`}
					className={componentInnerClassNames(
						'tabs__list__item__content'
					)}
				>
					{getPanel(selectedTab)}
				</div>
			)}
		</div>
	);
}

export { default as TabPanel } from './tab-panel';
export { default as TabMenu } from './tab-menu';
export default Tabs;
