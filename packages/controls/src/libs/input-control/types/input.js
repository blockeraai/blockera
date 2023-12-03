// @flow

import type { Node } from 'react';

export type TInputItem = {
	// eslint-disable-next-line
	unitType?:
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
		| 'order'
		| 'flex-basis'
		| 'flex-shrink'
		| 'flex-grow'
		| 'z-index',
	units?: Array<Object>,
	noBorder?: boolean,
	id?: number | string,
	range?: boolean,
	label?: string,
	columns?: string,
	defaultValue: string | number,
	onChange: (event: Object) => string | number,
	field?: string,
	className?: string,
	type?: 'text' | 'number',
	min?: number,
	max?: number,
	validator?: (value: string | number) => boolean,
	disabled?: boolean,
	drag?: boolean,
	float?: boolean,
	actions?: Node,
};
