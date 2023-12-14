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
	popoverTitle?: string,
	className?: string,
	defaultValue?: Array<Object>,
	onChange?: () => {},
};
