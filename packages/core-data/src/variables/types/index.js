// @flow

export type VariableCategory =
	| 'font-size'
	| 'linear-gradient'
	| 'radial-gradient'
	| 'spacing'
	| 'width-size'
	| 'theme-color';

export type VariableItem = {
	...Object,
	name: string,
	slug: string,
	value: string,
	fluid?: {
		min?: string,
		max?: string,
	},
};
