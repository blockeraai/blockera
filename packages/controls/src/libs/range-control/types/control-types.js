// @flow

export type TValueCleanup = string | number;

export type TRangeControlProps = {
	id?: string,
	label?: string,
	field?: string,
	columns?: string,
	defaultValue?: number | string,
	onChange?: () => {},
	min?: number,
	max?: number,
	withInputField?: boolean,
	initialPosition?: number,
	className?: string,
};
