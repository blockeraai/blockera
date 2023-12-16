// @flow

export type ControlSize = 'normal' | 'input' | 'small' | 'extra-small';

export type ControlGeneralTypes = {
	id?: string,
	controlName?: string,
	children?: any,
	className?: string,
	field?: string,
	//
	label?: any,
	columns?: string,
	style?: Object,
	//
	defaultValue?: string | number | Object,
	onChange?: (data: any) => void,
	valueCleanup?: (data: any) => void,
	//
	'data-test'?: string,
	'aria-label'?: string,
};

export type ControlValueAddonTypes = {
	controlAddonTypes?: Array<string>,
	variableTypes?: Array<string>,
	dynamicValueTypes?: Array<string>,
};
