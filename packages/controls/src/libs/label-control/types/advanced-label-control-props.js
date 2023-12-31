// @flow

/**
 * Internal dependencies
 */
import type { LabelControlProps } from './label-control-props';

export type AdvancedLabelControlProps = {
	...LabelControlProps,
	blockName: string,
	attribute: string,
};
