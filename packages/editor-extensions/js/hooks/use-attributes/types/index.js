// @flow

/**
 * Internal dependencies
 */
import type { StateTypes, TStates } from '../../../libs/block-states/types';

export type GetBlockStatesParams = {
	states: { [key: TStates]: StateTypes },
	inInnerBlock?: boolean,
};
