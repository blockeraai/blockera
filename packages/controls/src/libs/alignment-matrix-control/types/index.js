// @flow

export type Props = {
	inputFields?: boolean,
	size?: number,
	//
	id?: string,
	label?: string,
	columns?: string,
	defaultValue?: {
		top: string,
		left: string,
	},
	onChange?: () => void,
	field?: string,
	//
	className?: string,
};

export type Location = 'top' | 'bottom' | 'right' | 'left' | 'center';
export type Coordinates = {
	calculated: boolean,
	compact: string,
	top: {
		number: string,
		text: string,
	},
	left: {
		number: string,
		text: string,
	},
};
