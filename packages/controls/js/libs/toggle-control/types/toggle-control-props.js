// @flow

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type TToggleControlProps = {
	...ControlGeneralTypes,
	defaultValue?: boolean,
	labelType?: 'advanced' | 'simple' | 'self',
};
