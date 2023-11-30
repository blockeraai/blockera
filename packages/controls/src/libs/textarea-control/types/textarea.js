// @flow

export type TTextAreaItem = {
	value: string,
	id?: number | string,
	label?: string,
	columns?: string,
	defaultValue: string | number,
	onChange: (event: Object) => string | number,
	field?: string,
	className?: string,
	disabled?: boolean,
	height?: number,
};
