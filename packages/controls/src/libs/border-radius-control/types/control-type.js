// @flow

export type TValue = {
	type: 'all' | 'custom',
	all: string,
	topLeft?: string,
	topRight?: string,
	bottomLeft?: string,
	bottomRight?: string,
};

export type TBorderRadiusControlProps = {
	id?: string,
	label?: string,
	defaultValue?: TValue,
	className?: string,
	onChange?: () => {},
};
