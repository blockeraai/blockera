// @flow

export type TItem = {
	type:
		| 'blur'
		| 'drop-shadow'
		| 'brightness'
		| 'contrast'
		| 'hue-rotate'
		| 'saturate'
		| 'grayscale'
		| 'invert'
		| 'sepia',
	blur: string,
	brightness: string,
	contrast: string,
	'hue-rotate': string,
	saturate: string,
	grayscale: string,
	invert: string,
	sepia: string,
	'drop-shadow-x': string,
	'drop-shadow-y': string,
	'drop-shadow-blur': string,
	'drop-shadow-color': string,
	isVisible: boolean,
};

export type TFilterControlProps = {
	id?: string,
	defaultRepeaterItemValue?: TItem,
	popoverLabel?: string,
	className?: string,
	defaultValue?: Array<Object>,
	onChange?: () => {},
};

export type TValueCleanUp = Array<Object> | any;
