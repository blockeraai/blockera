// @flow

type ID = string | number;

type Attribute = {
	key: string,
	value: string,
	isVisible: Boolean,
};

type DefaultValueProps = {
	link?: string,
	target?: Boolean,
	nofollow?: Boolean,
	label?: string,
	attributes?: Array<Attribute>,
};

export type TLinkControlProps = {
	label: string,
	columns?: string,
	field?: string,
	onChange?: () => any,
	className?: string,
	placeholder?: string,
	attributesId?: ID,
	defaultValue?: DefaultValueProps,
	advancedOpen?: 'auto' | Boolean,
};
