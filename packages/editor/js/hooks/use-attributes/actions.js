// @flow

export type UseAttributesActions = {
	updateNormalState: () => Object,
	updateBlockStates: () => Object,
	reset: (resetAll?: boolean) => Object,
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
		updateInnerBlockStates(): Object {
			return {
				type: 'UPDATE_INNER_BLOCK_STATES',
				...params,
			};
		},
		updateBlockStates(): Object {
			return {
				type: 'UPDATE_BLOCK_STATES',
				...params,
			};
		},
		reset(resetAll: boolean = false): Object {
			return {
				type: resetAll ? 'RESET_ALL' : 'RESET',
				...params,
			};
		},
	};
};

export default actions;
