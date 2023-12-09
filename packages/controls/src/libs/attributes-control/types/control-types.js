// @flow

export type TItem = {
	key: string,
	__key: string,
	value: string,
	isVisible: boolean,
};

export type TAttributesControlProps = {
	id?: string,
	defaultValue?: [],
	onChange?: () => {},
	defaultRepeaterItemValue?: TItem,
	popoverTitle?: string,
	className?: string,
};
