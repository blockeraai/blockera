// @flow

/**
 * Publisher dependencies
 */
import type {
	StateGraph,
	StateGraphItem,
} from '@publisher/extensions/src/libs/block-states';

export type LabelChangedStates = Array<{
	id: number,
	...StateGraphItem,
}>;

export type LabelStates = {
	graph?: {
		id: number,
		...StateGraph,
	},
	controlId?: string,
	changedStates: LabelChangedStates,
	isChangedState: (activeState: string) => Object,
};
