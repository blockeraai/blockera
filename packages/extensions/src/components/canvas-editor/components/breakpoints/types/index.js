// @flow

/**
 * Internal dependencies
 */
import type { BreakpointTypes } from '../../../../../libs/block-states/types';

export type BreakpointsComponentProps = {
	refId: Object,
	className: string,
};

export type HandleOnPickBreakpoints = (device: string) => void;
export type HandleOnChangeBreakpoints = (key: string, value: any) => void;

export type BreakpointSettingsComponentProps = {
	breakpoints: BreakpointTypes,
	onChange: HandleOnChangeBreakpoints,
};

export type PickedBreakpointsComponentProps = {
	onClick: HandleOnPickBreakpoints,
};
