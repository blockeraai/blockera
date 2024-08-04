// @flow

/**
 * Internal dependencies
 */
import type {
	StateTypes,
	TBreakpoint,
	TStates,
} from '../../../extensions/libs/block-states/types';
import type { AdvancedLabelControlProps } from '../../../components/editor-advanced-label/types';

export type CalculatedAdvancedLabelProps = {
	isChanged: boolean,
	isInnerBlock: boolean,
	isChangedOnOtherStates: boolean,
	isChangedOnCurrentState: boolean,
	isChangedOnCurrentBreakpointNormal: boolean,
	isChangedNormalStateOnBaseBreakpoint: boolean,
};

export type AdvancedLabelHookProps = {
	...AdvancedLabelControlProps,
	value: any,
	defaultValue: any,
	currentState?: TStates,
	isNormalState: boolean,
	blockAttributes: Object,
	currentBlockState?: StateTypes,
	currentBreakpoint?: TBreakpoint,
	currentInnerBlockState?: TStates,
};
