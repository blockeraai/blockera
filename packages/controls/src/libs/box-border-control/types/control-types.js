// @flow

export type TBoxBorderControl = {
	id?: String,
	label?: String,
	defaultValue?: TValueTypes,
	onChange?: () => {},
	columns?: String,
	field?: string,
	className?: string,
};

export type TValueTypes = {
	type: 'all' | 'custom',
	all: {
		width: string,
		style: string,
		color: string,
	},
	left?: {
		width: string,
		style: string,
		color: string,
	},
	right?: {
		width: string,
		style: string,
		color: string,
	},
	top?: {
		width: string,
		style: string,
		color: string,
	},
	bottom?: {
		width: string,
		style: string,
		color: string,
	},
};
