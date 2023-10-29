// @flow

export type THeaderProps = {
	item: { key: String, value?: string },
	itemId: number,
	isOpen: boolean,
	setOpen: (isOpen: boolean) => void,
	children?: any,
	isOpenPopoverEvent: (event: Object) => void,
};

export type TRepeaterItemValue = {
	key: string,
	__key?: string,
	value: string,
	isVisible?: boolean,
};

export type TAttributeControlProps = {
	id?: string,
	attributeElement: 'a' | 'button' | 'ol' | 'general',
	defaultValue?: [],
	onChange?: () => {},
	defaultRepeaterItemValue?: TRepeaterItemValue,
	popoverLabel?: string,
	className?: string,
};

export type TAttributeFieldKeyOptions = {
	element?: 'a' | 'button' | 'ol' | 'general',
};

export type TAttributeFieldValueOptions = {
	element?: 'a' | 'button' | 'ol' | 'general',
	attribute?: string,
};

type TOptionValue = {
	label: String,
	value: string,
	type?: String,
	options?: TOptionValue[],
};
export type TOptionsReturn = TOptionValue[];

export type TFieldsProps = {
	item: TRepeaterItemValue,
	itemId: number,
};
