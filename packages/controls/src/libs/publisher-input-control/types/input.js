// @flow

export type TInputItem = {
	unitType:
		| ''
		| 'outline'
		| 'text-shadow'
		| 'box-shadow'
		| 'background-size'
		| 'letter-spacing'
		| 'text-indent'
		| 'background-position'
		| 'duration'
		| 'angle'
		| 'percent'
		| 'width'
		| 'padding'
		| 'essential'
		| 'general'
		| 'margin'
		| 'order',
	units?: Array<Object>,
	noBorder?: boolean,
	id?: number,
	range?: boolean,
	label?: string,
	columns?: string,
	defaultValue: string | number,
	onChange: (event: Object) => string | number,
	field?: string,
	className?: string,
	type: 'text' | 'number',
	min?: number,
	max?: number,
	validator?: (value: string | number) => boolean,
	disabled?: boolean,
};
