// @flow
import type { MixedElement } from 'react';

export type TTabProps = {
	name: string,
	title: string,
	icon: MixedElement,
	className: string,
};

export type TTabsProps = {
	activeTab: string,
	tabs: Array<TTabProps>,
	getPanel: (tab: TTabProps) => Object,
};
