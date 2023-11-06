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
