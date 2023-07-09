import createSelector from 'rememo';

export const getControls = createSelector(
	(state) => Object.values(state.controlReducer),
	(state) => [state.controlReducer]
);

export const getControl = (state, fieldName) => {
	return state.controlReducer[fieldName];
};
