// @flow

/**
 * Publisher dependencies
 */
import type {
	StateGraph,
	StateGraphItem,
} from '@publisher/extensions/src/libs/block-states/types';

export type LabelChangedStates = Array<{
	id: number,
	...StateGraphItem,
}>;

export type LabelStates = {
	graph: {
		id: number,
		...StateGraph,
	},
	controlId?: string,
	isChangedState: (activeState: string) => Object,
};
