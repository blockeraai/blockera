// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { memo } from '@wordpress/element';
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
import type { TTabMenuProps } from './types';
import ConditionalWrapper from '../conditional-wrapper';

function TabMenu({
	tabs,
	selected,
	instanceId,
	orientation = 'horizontal',
	activeClass = 'is-active-tab',
	activeIcon,
	injectMenuEnd,
	heading,
	onTabClick,
}: TTabMenuProps): Element<any> {
	const onNavigate = (childIndex: number, child: Object): void => {
		child.click();
	};

	return (
		<NavigableMenu
			role="tablist"
			orientation={orientation}
			onNavigate={onNavigate}
			className={componentClassNames('tabs__list')}
		>
			{heading && (
				<div className={componentInnerClassNames('tabs__heading')}>
					{heading}
				</div>
			)}

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
						aria-controls={`${instanceId}-${tab.name}-view`}
						selected={tab.name === selected}
						key={tab.name}
						onClick={() => onTabClick(tab.name)}
						data-test={`${tab.name}-tab`}
					>
						{tab.icon}

						{tab.title}

						{activeIcon && tab.name === selected && (
							<span
								className={componentInnerClassNames(
									'active-icon'
								)}
							>
								{activeIcon}
							</span>
						)}
					</Button>
				</ConditionalWrapper>
			))}

			{injectMenuEnd && <>{injectMenuEnd}</>}
		</NavigableMenu>
	);
}

export default (memo(TabMenu): typeof TabMenu);
