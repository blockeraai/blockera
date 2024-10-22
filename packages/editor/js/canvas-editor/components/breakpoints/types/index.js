// @flow

/**
 * Internal dependencies
 */
import type {
	BreakpointTypes,
	TBreakpoint,
} from '../../../../extensions/libs/block-states/types';

export type BreakpointsComponentProps = {
	className: string,
};

export type HandleOnPickBreakpoints = (device: string) => void;
export type HandleOnChangeBreakpoints = (key: string, value: any) => void;

export type BreakpointSettingsComponentProps = {
	breakpoints: BreakpointTypes,
	onClick: (device: string) => void,
	onChange: HandleOnChangeBreakpoints,
};

export type PickedBreakpointsComponentProps = {
	onClick: HandleOnPickBreakpoints,
	updateBlock: (device: string) => void,
	updaterDeviceIndicator: ((device: TBreakpoint) => void) => void,
};
