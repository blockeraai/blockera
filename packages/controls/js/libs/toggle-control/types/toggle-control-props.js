// @flow

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type TToggleControlProps = {
	...ControlGeneralTypes,
	defaultValue?: boolean,
	disabled?: boolean,
	labelType?: 'advanced' | 'simple' | 'self',
	size?: 'small' | 'normal',
};
