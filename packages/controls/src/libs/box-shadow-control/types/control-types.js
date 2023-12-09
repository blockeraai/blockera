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
	popoverTitle?: string,
	className?: string,
	defaultValue?: Array<Object>,
	onChange?: () => {},
};
