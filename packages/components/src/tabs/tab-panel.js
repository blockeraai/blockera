// @flow
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import classnames from 'classnames';
import type { Element } from 'react';
import { partial, find } from 'lodash';
import { useInstanceId } from '@wordpress/compose';
import { useState, useEffect } from '@wordpress/element';
import { NavigableMenu, Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Flex from '../flex';
import type { TTabPanelProps } from './types';
import { ConditionalWrapper } from '../index';
import { Tooltip } from '../tooltip';

const noop = () => {};

export default function TabPanel({
	tabs,
	children,
	onSelect,
	className,
	orientation,
	activeClass,
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

	const Menu = () => (
		<NavigableMenu
			role="tablist"
			orientation={orientation}
			onNavigate={onNavigate}
			className="components-tab-panel__tabs"
		>
			{tabs.map((tab) => (
				// eslint-disable-next-line react/jsx-key
				<ConditionalWrapper
					wrapper={(children) => (
						<Tooltip text={tab.tooltip} key={tab.name}>
							{children}
						</Tooltip>
					)}
					condition={tab.tooltip !== undefined}
				>
					<Button
						className={classnames(
							'components-tab-panel__tabs-item blockera-tab-button',
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
						data-test={`${tab.name}-tab`}
					>
						<Flex
							direction={'column'}
							alignItems={'center'}
							gap={'5px'}
						>
							<div data-test={'blockera-tab-icon'}>
								{tab.icon}
							</div>
							{tab.title}
						</Flex>
					</Button>
				</ConditionalWrapper>
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

TabPanel.propTypes = {
	// $FlowFixMe
	tabs: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			title: PropTypes.string,
			className: PropTypes.string,
			icon: PropTypes.element,
		})
	),
	children: PropTypes.element,
	onSelect: PropTypes.func,
	className: PropTypes.string,
	orientation: PropTypes.string,
	activeClass: PropTypes.string,
	initialTabName: PropTypes.string,
};

TabPanel.defaultProps = {
	onSelect: noop,
	activeClass: 'is-active',
	orientation: 'horizontal',
	initialTabName: undefined,
};
