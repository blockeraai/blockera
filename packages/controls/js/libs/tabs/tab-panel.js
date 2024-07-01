// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { useInstanceId } from '@wordpress/compose';
import { useState, useEffect } from '@wordpress/element';
import { NavigableMenu, Button } from '@wordpress/components';

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
import { Tooltip } from '../tooltip';
import type { TTabPanelProps } from './types';
import ConditionalWrapper from '../conditional-wrapper';

export default function TabPanel({
	tabs,
	children,
	onSelect,
	className,
	design = 'clean',
	orientation = 'horizontal',
	activeClass = 'is-active-tab',
	initialTabName,
}: TTabPanelProps): Element<any> {
	const instanceId = useInstanceId(TabPanel, 'tab-panel');
	const [selected, setSelected] = useState(null);
	const handleClick = (tabKey: string): void => {
		setSelected(tabKey);
		onSelect(tabKey);
	};
	const onNavigate = (childIndex: number, child: Object): void => {
		child.click();
	};

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

	const Menu = () => (
		<NavigableMenu
			role="tablist"
			orientation={orientation}
			onNavigate={onNavigate}
			className={componentClassNames('tabs__list')}
		>
			{tabs.map((tab) => (
				<ConditionalWrapper
					key={tab.name}
					wrapper={(children) => (
						<Tooltip text={tab.tooltip} key={tab.name}>
							{children}
						</Tooltip>
					)}
					condition={tab.tooltip !== undefined}
				>
					<Button
						className={componentInnerClassNames(
							'tabs__list__item',
							'tab-item-button',
							tab.className,
							{
								[(activeClass: string)]: tab.name === selected,
							}
						)}
						tabId={`${instanceId}-${tab.name}`}
						aria-controls={`${instanceId}-${tab.name}-view`}
						selected={tab.name === selected}
						key={tab.name}
						onClick={() => handleClick(tab.name)}
						data-test={`${tab.name}-tab`}
					>
						{tab.icon}

						{tab.title}
					</Button>
				</ConditionalWrapper>
			))}
		</NavigableMenu>
	);

	return (
		<div
			className={componentClassNames(
				'tabs',
				'design-' + design,
				className
			)}
		>
			<Menu />
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
