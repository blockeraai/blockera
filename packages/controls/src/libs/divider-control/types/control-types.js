// @flow

export type TItem = {
	position: 'top' | 'bottom',
	shape: { type: 'shape' | 'custom', id: string },
	color: string,
	size: { width: string, height: string },
	animate: boolean,
	duration: string,
	flip: boolean,
	onFront: boolean,
	isVisible: boolean,
};

export type TDividerControlProps = {
	id?: string,
	defaultRepeaterItemValue?: TItem,
	popoverTitle?: string,
	className?: string,
	defaultValue?: Array<Object>,
	onChange?: () => {},
};
