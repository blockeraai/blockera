// @flow
import type { MixedElement } from 'react';

export type TTabProps = {
	name: string,
	title: string,
	tooltip?: string,
	className?: string,
	icon?: MixedElement,
};

export type TTabsProps = {
	activeTab: string,
	tabs: Array<TTabProps>,
	getPanel: (tab: TTabProps) => Object,
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
	design?: 'default' | 'modern',
	className?: string,
};
