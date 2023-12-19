// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

export type AdvancedLabelControlProps = {
	label?: string,
	attribute?: string,
	blockName?: string,
	className?: string,
	ariaLabel?: string,
	isChanged?: boolean,
	path?: null | string,
	repeaterItem?: number,
	fieldId?: string | null,
	isChangedOnNormal?: boolean,
	isChangedOnOtherStates?: boolean,
	description?: string | MixedElement,
	onClick?: (event: MouseEvent) => void,
	resetToDefault?: (args?: {
		path?: null | string,
		propId?: string | null,
		repeaterItem?: number,
	}) => any,
};
