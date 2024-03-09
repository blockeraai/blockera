// @flow

/**
 * Publisher dependencies
 */
import type {
	StateGraph,
	StateGraphItem,
} from '@publisher/extensions/src/libs/block-states/store/selector';

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
