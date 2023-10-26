// @flow

export type TDefaultValue = {
	width: string,
	style: 'solid' | 'dashed' | 'dotted' | 'double',
	color: string,
};

export type TBorderControlProps = {
	linesDirection?: 'horizontal' | 'vertical',
	id?: string,
	label?: string,
	field?: string,
	columns?: string,
	defaultValue: TDefaultValue,
	onChange: () => {},
	customMenuPosition?: 'top' | 'bottom',
	__isWidthFocused?: boolean,
	__isColorFocused?: boolean,
	__isStyleFocused?: boolean,
};
