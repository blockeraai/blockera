// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import {
	memo,
	useRef,
	useState,
	useLayoutEffect,
	useEffect,
	useCallback,
} from '@wordpress/element';
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
	design = 'clean',
}: TTabMenuProps): Element<any> {
	const listContainerRef = useRef<?HTMLDivElement>(null);
	const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
	const [transitionEnabled, setTransitionEnabled] = useState(false);
	const hasEnabledTransitionRef = useRef(false);
	// Store selected in a ref so updateIndicator identity stays stable across tab changes.
	const selectedRef = useRef(selected);
	selectedRef.current = selected;

	const updateIndicator = useCallback(() => {
		if (design !== 'modern' || !listContainerRef.current) {
			return;
		}
		const wrapperEl = listContainerRef.current;
		const listEl = wrapperEl.querySelector(
			'.blockera-component-tabs__list'
		);
		const currentSelected = selectedRef.current;
		// Prefer data-test for reliable lookup when selected is known.
		let activeTab =
			currentSelected &&
			wrapperEl.querySelector(`[data-test="${currentSelected}-tab"]`);
		if (!activeTab) {
			activeTab = wrapperEl.querySelector(`.${activeClass}`);
		}
		if (!listEl || !activeTab) {
			return;
		}
		// Walk up to the direct flex child of list for accurate width when wrapped by Tooltip.
		let tabEl = activeTab;
		while (tabEl?.parentElement && tabEl.parentElement !== listEl) {
			tabEl = tabEl.parentElement;
		}
		const wrapperRect = wrapperEl.getBoundingClientRect();
		const tabRect = tabEl.getBoundingClientRect();
		const newLeft = tabRect.left - wrapperRect.left;
		const newWidth = tabRect.width;
		// Only update state when values actually changed to avoid unnecessary re-renders.
		setIndicatorStyle((prev) => {
			if (prev.left === newLeft && prev.width === newWidth) {
				return prev;
			}
			return { left: newLeft, width: newWidth };
		});
		// Enable transition after first successful measurement (no transition on initial load).
		if (!hasEnabledTransitionRef.current) {
			hasEnabledTransitionRef.current = true;
			requestAnimationFrame(() => setTransitionEnabled(true));
		}
	}, [design, activeClass]);

	useLayoutEffect(() => {
		updateIndicator();
		// Re-measure after paint in case layout settles asynchronously.
		const raf = requestAnimationFrame(updateIndicator);
		return () => cancelAnimationFrame(raf);
	}, [selected, tabs, updateIndicator]);

	// Re-measure when container or tabs resize. Stable callback keeps this effect from re-running on tab changes.
	useEffect(() => {
		if (design !== 'modern' || !listContainerRef.current) {
			return;
		}
		const wrapper = listContainerRef.current;
		const listEl = wrapper.querySelector('.blockera-component-tabs__list');
		const ro = new ResizeObserver(updateIndicator);
		ro.observe(wrapper);
		if (listEl) {
			ro.observe(listEl);
		}
		return () => ro.disconnect();
	}, [design, updateIndicator]);

	const onNavigate = useCallback(
		(childIndex: number, child: Object): void => {
			child.click();
		},
		[]
	);

	return (
		<div
			ref={listContainerRef}
			className={componentClassNames('tabs__list-wrapper', {
				'is-ready': design === 'modern' && transitionEnabled,
			})}
		>
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
									[(activeClass: string)]:
										tab.name === selected,
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
			{design === 'modern' && (
				<div
					className={componentInnerClassNames(
						'tabs__list__indicator'
					)}
					style={{
						left: indicatorStyle.left,
						width: indicatorStyle.width,
					}}
					aria-hidden="true"
				/>
			)}
		</div>
	);
}

export default (memo(TabMenu): typeof TabMenu);
