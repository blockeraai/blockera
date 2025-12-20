// @flow
import type { MixedElement, Element } from 'react';

export type TTabProps = {
	name: string,
	title: string,
	tooltip?: string,
	className?: string,
	icon?: MixedElement,
};

export type TTabExtendedProps = {
	...TTabProps,
	icon?: Element<any>,
	settingSlug?: string,
};

export type TTabsProps = {
	activeTab: string,
	tabs: Array<TTabExtendedProps>,
	getPanel: (tab: TTabExtendedProps) => Object,
	setCurrentTab?: (tabName: string) => void,
	/**
	 * @default 'horizontal'
	 */
	orientation?: 'horizontal' | 'vertical',
	/**
	 * Design of the tab.
	 *
	 * @default 'modern'
	 */
	design?: 'default' | 'modern' | 'clean',
	className?: string,
	/**
	 * @default 'is-active-tab'
	 */
	activeClass?: string,
	/**
	 * Icon for active item
	 */
	activeIcon?: Element<any>,
	/**
	 * Inject items to end of the menu
	 */
	injectMenuEnd?: any,
	/**
	 * Heading for navigation
	 */
	heading?: string,
};
