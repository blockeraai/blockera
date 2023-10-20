// @flow
export type TTabProps = {
	name: string,
	title: string,
	icon: {
		name: string,
		library: string,
	},
	className: string,
};

export type TTabsProps = {
	tabs: Array<TTabProps>,
	getPanel: (tab: TTabProps) => Object,
};
