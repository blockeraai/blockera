// @flow

/**
 * Internal dependencies
 */
import type { TBlockProps } from './block-props';
import type { InnerBlockType } from '../inner-blocks/types';
import type { TBreakpoint, TStates } from '../block-states/types';

export type StylesProps = {
	state: TStates,
	clientId: string,
	blockName: string,
	selectors: Object,
	supports?: Object,
	attributes: Object,
	blockProps: TBlockProps,
	activeDeviceType?: TBreakpoint,
	currentBlock: 'master' | InnerBlockType | string,
};
