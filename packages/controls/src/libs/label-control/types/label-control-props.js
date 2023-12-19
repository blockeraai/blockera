// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

export type LabelControlProps = {
	label?: string,
	blockName?: string,
	attribute?: string,
	className?: string,
	ariaLabel?: string,
	isChanged?: boolean,
	path?: string | null,
	repeaterItem?: number,
	fieldId?: string | null,
	isChangedOnNormal?: boolean,
	isChangedOnOtherStates?: boolean,
	mode?: 'advanced' | 'simple',
	description?: string | MixedElement,
	onClick?: (event: MouseEvent) => void,
	resetToDefault?: (args?: { path?: null | string }) => any,
};
