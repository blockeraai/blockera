// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { useInstanceId } from '@wordpress/compose';
import { useState, useEffect, useCallback } from '@wordpress/element';

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
import type { TTabPanelProps } from './types';

export default function TabPanel({
	tabs,
	children,
	onSelect,
	className,
	design = 'clean',
	orientation = 'horizontal',
	activeClass = 'is-active-tab',
	activeIcon,
	initialTabName,
	injectMenuEnd,
	heading,
}: TTabPanelProps): Element<any> {
	const instanceId = useInstanceId(TabPanel, 'tab-panel');
	const [selected, setSelected] = useState(null);

	const handleClick = useCallback(
		(tabKey: string): void => {
			setSelected(tabKey);
			onSelect(tabKey);
		},
		[onSelect]
	);

	const selectedTab = tabs.find((tab) => tab.name === selected);
	const selectedId = `${instanceId}-${selectedTab?.name ?? 'none'}`;

	useEffect(() => {
		const newSelectedTab = tabs.find((tab) => tab.name === selected);
		if (!newSelectedTab) {
			setSelected(
				initialTabName || (tabs.length > 0 ? tabs[0].name : null)
			);
		}
	}, [initialTabName, selected, tabs]);

	return (
		<div
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
				onTabClick={handleClick}
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
					{children(selectedTab)}
				</div>
			)}
		</div>
	);
}
