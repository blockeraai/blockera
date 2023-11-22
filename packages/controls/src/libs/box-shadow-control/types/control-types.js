// @flow

export type TItem = {
	type: 'outer' | 'inner',
	x: string,
	y: string,
	blur: string,
	spread: string,
	color: string,
	isVisible: boolean,
};

export type TBoxShadowControlProps = {
	id?: string,
	defaultRepeaterItemValue?: TItem,
	popoverLabel?: string,
	className?: string,
	defaultValue?: Array<Object>,
	onChange?: () => {},
};
