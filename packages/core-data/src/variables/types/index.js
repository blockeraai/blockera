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
	| 'color';

export type VariableItem = {
	name: string,
	slug: string,
	value: string,
	fluid?: {
		min?: string,
		max?: string,
	},
	reference: ValueAddonReference,
};
