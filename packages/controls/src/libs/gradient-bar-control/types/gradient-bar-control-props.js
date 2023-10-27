// @flow
type ID = string;
export type TGradientBarControlProps = {
	id: ID,
	label?: string,
	columns?: string,
	defaultValue?: string,
	onChange?: () => void,
	field?: string,
	className?: string,
};
