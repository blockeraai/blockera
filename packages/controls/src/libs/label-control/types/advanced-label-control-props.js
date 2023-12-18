// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

export type AdvancedLabelControlProps = {
	label?: string,
	attribute: string,
	blockName: string,
	className?: string,
	ariaLabel?: string,
	path?: null | string,
	description?: string | MixedElement,
	onClick?: (event: MouseEvent) => void,
	resetToDefault?: (args?: { path?: null | string }) => any,
};
