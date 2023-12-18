// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

type IconOption = {
	label: string,
	value: string,
	icon: MixedElement,
};

type TextOption = {
	label: string,
	value: string,
};

type Option = IconOption | TextOption;

export type ToggleSelectControlProps = {
	...ControlGeneralTypes,
	isDeselectable?: boolean,
	options: Option[],
};
