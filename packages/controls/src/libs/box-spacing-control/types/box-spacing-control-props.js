// @flow

type ID = string | number;

type TDefaultValue = {
	margin: {
		top: string,
		right: string,
		bottom: string,
		left: string,
	},
	padding: {
		top: string,
		right: string,
		bottom: string,
		left: string,
	},
};

export type TBoxSpacingControlProps = {
	label?: string,
	id?: ID,
	defaultValue?: TDefaultValue,
	defaultRepeaterItemValue?: Object,
	onChange?: () => any,
	className?: string,
	props?: Object,
	field?: string,
	columns?: string,
	openSide?: 'top' | 'right' | 'bottom' | 'left' | '',
};
