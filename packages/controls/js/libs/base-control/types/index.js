// @flow

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';
import type { LabelControlProps } from '../../label-control/types';

export type BaseControlProps = {
	...ControlGeneralTypes,
	...LabelControlProps,
	controlName?: 'empty' | 'general' | string,
	style?: Object,
};
