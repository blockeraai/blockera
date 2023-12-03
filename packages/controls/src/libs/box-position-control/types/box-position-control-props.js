// @flow

type ID = string | number;

type TDefaultValue = {
	type: 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed',
	position: {
		top: string,
		right: string,
		bottom: string,
		left: string,
	},
};

export type TBoxPositionControlProps = {
	label?: string,
	id?: ID,
	defaultValue?: TDefaultValue,
	defaultRepeaterItemValue?: Object,
	onChange?: () => any,
	className?: string,
	props?: Object,
	openSide?: 'top' | 'right' | 'bottom' | 'left' | '',
};
