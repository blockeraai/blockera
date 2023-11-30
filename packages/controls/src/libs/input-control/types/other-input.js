// @flow

export type TOtherInput = {
	value: string,
	setValue: (value: string) => void,
	type: string,
	noBorder?: boolean,
	className?: string,
	disabled?: boolean,
	validator?: (value: string) => boolean,
};
