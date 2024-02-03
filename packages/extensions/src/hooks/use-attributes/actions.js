// @flow

export type UseAttributesActions = {
	updateNormalState: () => Object,
	updateInnerBlocks: (params: Object) => Object,
	updateBlockStates: () => Object,
	updateInnerBlockInsideParentState: () => Object,
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
		updateInnerBlocks({
			stateType,
			breakpointId,
			blockStateId,
			breakpointType,
		}): Object {
			return {
				type: 'UPDATE_INNER_BLOCKS',
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
