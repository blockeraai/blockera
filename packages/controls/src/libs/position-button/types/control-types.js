// @flow
/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type TPositionButtonProps = {
	...ControlGeneralTypes,
	popoverTitle?: string,
	alignmentMatrixLabel?: string,
	defaultValue?: { top: string, left: string },
	buttonLabel?: string,
};

export type TRenderPositionIcon = {
	top: string,
	left: string,
	defaultValue?: { top: string, left: string },
};
