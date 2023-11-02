// @flow

export type TItem = {
	key: string,
	__key: string,
	value: string,
	isVisible: boolean,
};

export type TAttributesControlProps = {
	id?: string,
	attributeElement: 'a' | 'button' | 'ol' | 'general',
	defaultValue?: [],
	onChange?: () => {},
	defaultRepeaterItemValue?: TItem,
	popoverLabel?: string,
	className?: string,
};
