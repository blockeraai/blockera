// @flow
/**
 * Internal dependencies
 */
import type { ValueAddonReference } from '../../types';

export type VariableCategory =
	| 'font-size'
	| 'linear-gradient'
	| 'radial-gradient'
	| 'spacing'
	| 'width-size'
	| 'color'
	| string;

export type VariableItem = {
	name: string,
	id: string,
	value: string,
	fluid?: {
		min?: string,
		max?: string,
	},
	reference: ValueAddonReference,
};
