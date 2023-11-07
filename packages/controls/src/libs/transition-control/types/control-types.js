// @flow

export type TItem = {
	type: string,
	duration: string,
	timing: string,
	delay: string,
	isVisible: boolean,
};
export type TTransitionControlProps = {
	defaultRepeaterItemValue?: TItem,
	popoverLabel?: string,
	className?: string,
	defaultValue?: Array<Object>,
	onChange?: () => {},
};
