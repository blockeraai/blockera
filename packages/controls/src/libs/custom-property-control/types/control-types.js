// @flow

export type TItem = {
	name: string,
	value: string,
	isVisible: boolean,
};

export type TCustomPropertyControlProps = {
	id?: string,
	defaultValue?: [],
	onChange?: () => {},
	defaultRepeaterItemValue?: TItem,
	popoverLabel?: string,
	className?: string,
};
