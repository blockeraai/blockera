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

const LIST_SELECTOR = '.blockera-component-tabs__list';

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
	const listElRef = useRef<?HTMLElement>(null);
	const indicatorRef = useRef<?HTMLDivElement>(null);
	const indicatorMetricsRef = useRef({ left: 0, width: 0 });
	const measureRafRef = useRef<?AnimationFrameID>(null);
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
		let listEl = listElRef.current;
		if (!listEl || !listEl.isConnected) {
			listEl = (wrapperEl.querySelector(LIST_SELECTOR): ?HTMLElement);
			listElRef.current = listEl;
		}
		const currentSelected = selectedRef.current;
		// Prefer data-test for reliable lookup when selected is known.
		let activeTab =
			currentSelected &&
			listEl &&
			listEl.querySelector(`[data-test="${currentSelected}-tab"]`);
		if (!activeTab && listEl) {
			activeTab = listEl.querySelector(`.${activeClass}`);
		}
		if (!listEl || !activeTab) {
			return;
		}
		// Walk up to the direct flex child of list for accurate width when wrapped by Tooltip.
		let tabEl = activeTab;
		while (
			tabEl instanceof HTMLElement &&
			tabEl.parentElement &&
			tabEl.parentElement !== listEl
		) {
			tabEl = tabEl.parentElement;
		}
		if (!(tabEl instanceof HTMLElement)) {
			return;
		}
		// Use offset dimensions so parent transforms (e.g. modal open scale) do not
		// skew the indicator; getBoundingClientRect includes transform scale.
		let offsetLeft = tabEl.offsetLeft;
		let offsetNode = tabEl.offsetParent;
		while (offsetNode instanceof HTMLElement && offsetNode !== wrapperEl) {
			offsetLeft += offsetNode.offsetLeft;
			offsetNode = offsetNode.offsetParent;
		}
		const newLeft = offsetLeft;
		const newWidth = tabEl.offsetWidth;
		const prev = indicatorMetricsRef.current;
		if (prev.left === newLeft && prev.width === newWidth) {
			return;
		}
		indicatorMetricsRef.current = { left: newLeft, width: newWidth };
		const indicatorEl = indicatorRef.current;
		if (indicatorEl) {
			indicatorEl.style.left = `${newLeft}px`;
			indicatorEl.style.width = `${newWidth}px`;
		}
		// Enable transition after first successful measurement (no transition on initial load).
		if (!hasEnabledTransitionRef.current) {
			hasEnabledTransitionRef.current = true;
			requestAnimationFrame(() => setTransitionEnabled(true));
		}
	}, [design, activeClass]);

	const scheduleIndicatorUpdate = useCallback(() => {
		if (measureRafRef.current !== null) {
			return;
		}
		measureRafRef.current = requestAnimationFrame(() => {
			measureRafRef.current = null;
			updateIndicator();
		});
	}, [updateIndicator]);

	useLayoutEffect(() => {
		if (design !== 'modern') {
			return;
		}
		if (listContainerRef.current) {
			listElRef.current = (listContainerRef.current.querySelector(
				LIST_SELECTOR
			): ?HTMLElement);
		}
		updateIndicator();
		scheduleIndicatorUpdate();
	}, [design, selected, tabs, updateIndicator, scheduleIndicatorUpdate]);

	// Observe resizes and modal open animation; coalesce bursts to one measure per frame.
	useEffect(() => {
		if (design !== 'modern' || !listContainerRef.current) {
			return;
		}
		const wrapper = listContainerRef.current;
		const listEl = (wrapper.querySelector(LIST_SELECTOR): ?HTMLElement);
		listElRef.current = listEl;

		const ro = new ResizeObserver(scheduleIndicatorUpdate);
		ro.observe(wrapper);
		if (listEl) {
			ro.observe(listEl);
		}

		const modalEl = wrapper.closest(
			'.components-modal, .blockera-component-modal'
		);
		const onTransitionEnd = (event: TransitionEvent) => {
			if (modalEl && event.target === modalEl) {
				scheduleIndicatorUpdate();
			}
		};
		if (modalEl) {
			modalEl.addEventListener('transitionend', onTransitionEnd);
		}

		return () => {
			ro.disconnect();
			if (modalEl) {
				modalEl.removeEventListener('transitionend', onTransitionEnd);
			}
			if (measureRafRef.current !== null) {
				cancelAnimationFrame(measureRafRef.current);
				measureRafRef.current = null;
			}
		};
	}, [design, scheduleIndicatorUpdate]);

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
					ref={indicatorRef}
					className={componentInnerClassNames(
						'tabs__list__indicator'
					)}
					aria-hidden="true"
				/>
			)}
		</div>
	);
}

export default (memo(TabMenu): typeof TabMenu);
