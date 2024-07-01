// @flow

/**
 * Internal dependencies
 */
import type { TBreakpoint, TStates } from '../block-states/types';
import type { THandleOnChangeWithPath } from './handle-onchange-with-path';
import type { THandleOnChangeAttributes } from './handle-onchange-attributes';

export type ExtensionProps = {
	path: string,
	breakpoint: TBreakpoint,
	activeBlockState: TStates,
	isNormalState: () => boolean,
	handleOnChangeWithPath: THandleOnChangeWithPath,
	handleOnChangeAttributes: THandleOnChangeAttributes,
};
