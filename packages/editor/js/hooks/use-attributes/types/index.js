// @flow

/**
 * Internal dependencies
 */
import type {
	StateTypes,
	TStates,
} from '../../../extensions/libs/block-states/types';

export type GetBlockStatesParams = {
	states: { [key: TStates]: StateTypes },
	inInnerBlock?: boolean,
};
