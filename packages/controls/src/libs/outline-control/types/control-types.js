// @flow

export type TItem = {
	border: {
		width: string,
		style: string,
		color: string,
	},
	offset: string,
	isVisible: boolean,
};

export type TOutlineControlProps = {
	id?: string,
	className?: string,
	defaultRepeaterItemValue?: TItem,
	popoverLabel?: string,
	defaultValue?: Array<Object>,
	onChange?: () => {},
};
