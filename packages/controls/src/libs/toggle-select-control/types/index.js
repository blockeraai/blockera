// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

type Option = {
	'aria-label'?: string,
	label: string,
	value: string,
	disabled?: boolean,
	showTooltip?: boolean,
};

type IconOption = {
	...Option,
	icon: MixedElement,
};

type TextOption = {
	...Option,
};

type OptionItem = IconOption | TextOption;

export type ToggleSelectControlProps = {
	...ControlGeneralTypes,
	isDeselectable?: boolean,
	options: Array<OptionItem>,
};
