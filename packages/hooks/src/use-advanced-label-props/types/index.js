// @flow

/**
 * Publisher dependencies
 */
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
	currentState: string,
	isNormalState: boolean,
	blockAttributes: Object,
	blockStateId: number,
	breakpointId: number,
};
