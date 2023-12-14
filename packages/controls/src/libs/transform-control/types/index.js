// @flow

export type RepeaterItem = {
	type: 'move' | 'scale' | 'rotate' | 'skew',
	'move-x': string,
	'move-y': string,
	'move-z': string,
	scale: string,
	'rotate-x': string,
	'rotate-y': string,
	'rotate-z': string,
	'skew-x': string,
	'skew-y': string,
	isVisible: boolean,
};

export type Props = {
	popoverTitle?: string,
	className?: string,
	defaultValue?: RepeaterItem[],
	onChange?: () => void,
	defaultRepeaterItemValue?: RepeaterItem,
};
