// @flow

export type TNumberInput = {
	value: number | string,
	setValue: (value: string | number) => void,
	noBorder?: boolean,
	className?: string,
	disabled?: boolean,
	validator?: ?(value: string | number) => boolean,
	min?: number,
	max?: number,
	range?: boolean,
	arrows?: boolean,
};
