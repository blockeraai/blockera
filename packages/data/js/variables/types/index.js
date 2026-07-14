// @flow
/**
 * Internal dependencies
 */
import type { ValueAddonReference } from '../../types';

export type VariableCategory =
	| 'font-size'
	| 'line-height'
	| 'linear-gradient'
	| 'radial-gradient'
	| 'spacing'
	| 'width-size'
	| 'color'
	| string;

export type VariableItem = {
	name: string,
	id: string,
	/** Scalar CSS token or structured preset payload (e.g. `{ items }`, border box). */
	value: mixed,
	fluid?: {
		min?: string,
		max?: string,
	},
	reference: ValueAddonReference,
};
