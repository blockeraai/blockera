// @flow

/**
 * Internal dependencies
 */
import type {
	TStates,
	TBreakpoint,
} from '../../extensions/libs/block-states/types';
import type { InnerBlockType } from '../../extensions/libs/inner-blocks/types';

export type ExtensionsStoreType = {
	config: Object,
	currentState: TStates,
	currentBreakpoint: TBreakpoint,
	currentInnerBlockState: TStates,
	getBlockInners: (clientId: string) => Object,
	currentBlock: string | 'master' | InnerBlockType,
	getInnerBlocksExtensionStateUpdater: (
		clientId: string
	) => (blockInners: Object) => void,
	getSelectedInnerBlockHistory: (clientId: string) => ?string,
};
