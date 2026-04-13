// @flow

/**
 * Internal dependencies
 */
import type {
	TBreakpoint,
	BreakpointTypes,
} from '../../../../../extensions/libs/block-card/block-states/types';

export type BreakpointsComponentProps = {
	className: string,
	editorMode: TBreakpoint,
};

export type HandleOnPickBreakpoints = (device: string) => void;
export type HandleOnChangeBreakpoints = (key: string, value: any) => void;

export type BreakpointSettingsComponentProps = {
	breakpoints: BreakpointTypes,
	defaultValue: BreakpointTypes,
	onChange: HandleOnChangeBreakpoints,
};

export type PickedBreakpointsComponentProps = {
	onClick: HandleOnPickBreakpoints,
	updateBlock: (device: string) => void,
	items: { [key: TBreakpoint | string]: BreakpointTypes },
	updaterDeviceIndicator: ((device: TBreakpoint) => void) => void,
};
