// @flow

/**
 * Publisher dependencies
 */
import type {
	StateTypes,
	TBreakpoint,
	TStates,
} from '@publisher/extensions/src/libs/block-states/types';
import type { AdvancedLabelControlProps } from '@publisher/controls/src/libs/label-control/types';

export type CalculatedAdvancedLabelProps = {
	isChanged: boolean,
	isChangedOnNormal: boolean,
	isChangedOnOtherStates: boolean,
	isChangedOnCurrentState: boolean,
};

export type AdvancedLabelHookProps = {
	...AdvancedLabelControlProps,
	value: any,
	defaultValue: any,
	currentState: TStates,
	isNormalState: boolean,
	blockAttributes: Object,
	currentBlockState: StateTypes,
	currentBreakpoint: TBreakpoint,
	currentInnerBlockState: TStates,
};
