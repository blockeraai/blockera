// @flow

export type UseAttributesActions = {
	updateNormalState: () => Object,
	updateBlockStates: () => Object,
	updateInnerBlockInsideParentState: () => Object,
	updateInnerBlockStates: (params: Object) => Object,
};

const actions = (params: Object): UseAttributesActions => {
	return {
		updateNormalState(): Object {
			return {
				type: 'UPDATE_NORMAL_STATE',
				...params,
			};
		},

		updateInnerBlockInsideParentState(): Object {
			return {
				type: 'UPDATE_INNER_BLOCK_INSIDE_PARENT_STATE',
				...params,
			};
		},
		updateInnerBlockStates({
			stateType,
			breakpointId,
			blockStateId,
			breakpointType,
		}): Object {
			return {
				type: 'UPDATE_INNER_BLOCK_STATES',
				...params,
				stateType,
				breakpointId,
				blockStateId,
				breakpointType,
			};
		},
		updateBlockStates(): Object {
			return {
				type: 'UPDATE_BLOCK_STATES',
				...params,
			};
		},
	};
};

export default actions;