// @flow

/**
 * Internal dependencies
 */
import type {
	StateGraph,
	StateGraphItem,
} from '../../../extensions/libs/block-states';

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
