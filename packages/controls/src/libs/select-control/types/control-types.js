// @flow

export type TSelectOption = {
	label: string,
	value: string,
	icon?: Element,
	type?: string,
	disabled?: boolean,
	options?: Array<TSelectControlProps>,
};

export type TCustomSelectOption = {
	name?: string,
	key: string,
	style?: Element,
	className?: string,
};

export type TSelectControlProps = {
	id: string,
	label?: string,
	field?: string,
	columns?: string,
	defaultValue?: string,
	onChange: () => {},
	type: 'native' | 'custom',
	options: Array<TSelectOption | TCustomSelectOption>,
	customMenuPosition?: 'bottom' | 'top',
	customHideInputIcon?: boolean,
	customHideInputLabel?: boolean,
	customInputCenterContent?: boolean,
	noBorder?: boolean,
	multiple?: boolean,
	classname?: string,
};
