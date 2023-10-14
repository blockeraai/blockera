/**
 * External dependencies
 */
import classnames from 'classnames';
import { partial, find } from 'lodash';
import { useInstanceId } from '@wordpress/compose';
import { NavigableMenu, Button } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Flex from '../flex';

const noop = () => {};

export default function TabPanel({
	tabs,
	children,
	className,
	initialTabName,
	onSelect = noop,
	orientation = 'horizontal',
	activeClass = 'is-active',
}) {
	const instanceId = useInstanceId(TabPanel, 'tab-panel');
	const [selected, setSelected] = useState(null);
	const handleClick = (tabKey) => {
		setSelected(tabKey);
		onSelect(tabKey);
	};
	const onNavigate = (childIndex, child) => {
		child.click();
	};
	const selectedTab = find(tabs, { name: selected });
	const selectedId = `${instanceId}-${selectedTab?.name ?? 'none'}`;

	useEffect(() => {
		const newSelectedTab = find(tabs, { name: selected });
		if (!newSelectedTab) {
			setSelected(
				initialTabName || (tabs.length > 0 ? tabs[0].name : null)
			);
		}
	}, [initialTabName, selected, tabs]);
	console.log(tabs);
	const Menu = () => (
		<NavigableMenu
			role="tablist"
			orientation={orientation}
			onNavigate={onNavigate}
			className="components-tab-panel__tabs"
		>
			{tabs.map((tab) => (
				<Button
					className={classnames(
						'components-tab-panel__tabs-item publisher-tab-button',
						tab.className,
						{
							[activeClass]: tab.name === selected,
						}
					)}
					tabId={`${instanceId}-${tab.name}`}
					aria-controls={`${instanceId}-${tab.name}-view`}
					selected={tab.name === selected}
					key={tab.name}
					onClick={partial(handleClick, tab.name)}
					// icon={tab.icon}
				>
					<Flex direction={'column'} alignItems={'center'}>
						{tab.icon}
						{tab.title}
					</Flex>
				</Button>
			))}
		</NavigableMenu>
	);

	return (
		<div className={className}>
			<Menu />
			{selectedTab && (
				<div
					key={selectedId}
					aria-labelledby={selectedId}
					role="tabpanel"
					id={`${selectedId}-view`}
					className="components-tab-panel__tab-content"
				>
					{children(selectedTab)}
				</div>
			)}
		</div>
	);
}
