// @flow
/**
 * Internal dependencies
 */
import type { ControlGeneralTypes, ControlSize } from '../../../types';

export type TPositionButtonProps = {
	...ControlGeneralTypes,
	size: ControlSize,
	defaultValue?: { top: string, left: string },
	/**
	 * Label for popover
	 */
	popoverTitle?: string,
	/**
	 * Label for field alignment-matrix. If you pass empty value the field will not be added and simple control will be rendered
	 *
	 * @default ""
	 */
	alignmentMatrixLabel?: string,
	/**
	 * Label for Button tooltip
	 */
	buttonLabel?: string,
};

export type TRenderPositionIcon = {
	top: string,
	left: string,
	defaultValue?: { top: string, left: string },
};
