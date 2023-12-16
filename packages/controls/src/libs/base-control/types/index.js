// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type BaseControlProps = {
	...ControlGeneralTypes,
	controlName?: 'empty' | 'general' | string,
	mode?: 'advanced' | 'simple',
	path?: string,
	description?: string | MixedElement,
	resetToDefault?: () => void,
};
