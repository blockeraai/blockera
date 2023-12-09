// @flow

import type { Node } from 'react';

export type TUnitInput = {
	value: string,
	setValue: (value: string) => void,
	defaultValue?: string | number,
	range?: boolean,
	noBorder?: boolean,
	className?: string,
	units?: empty | Array<Object>,
	disabled?: boolean,
	validator?: (value: string) => boolean,
	min?: number,
	max?: number,
	drag?: boolean,
	float?: boolean,
	smallWidth?: boolean,
	actions?: Node,
	children?: Node,
};
