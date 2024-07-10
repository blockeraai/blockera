// @flow

/**
 * Internal dependencies
 */
// import type { TBlockProps } from './block-props';
import type { InnerBlockType } from '../inner-blocks/types';
import type { TStates, TBreakpoint } from '../block-states/types';

export type StylesProps = {
	state: TStates,
	clientId: string,
	blockName: string,
	selectors: Object,
	// supports?: Object,
	attributes: Object,
	masterState: TStates,
	// blockProps: TBlockProps,
	activeDeviceType?: TBreakpoint,
	currentBlock: 'master' | InnerBlockType | string,
};
