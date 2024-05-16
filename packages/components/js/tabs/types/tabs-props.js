// @flow
import type { MixedElement } from 'react';

export type TTabProps = {
	name: string,
	title: string,
	tooltip?: string,
	className: string,
	icon?: MixedElement,
	settingSlug?: string,
};

export type TTabsProps = {
	activeTab: string,
	tabs: Array<TTabProps>,
	getPanel: (tab: TTabProps) => Object,
};
