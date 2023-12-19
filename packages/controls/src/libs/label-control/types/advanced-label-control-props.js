// @flow

/**
 * Internal dependencies
 */
import type { LabelControlProps } from './label-control-props';

export type AdvancedLabelControlProps = {
	...LabelControlProps,
	resetToDefault?: (args?: {
		path?: null | string,
		propId?: string | null,
		repeaterItem?: number,
	}) => any,
};
