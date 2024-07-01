import createSelector from 'rememo';

export const getControls = createSelector(
	(state) => Object.values(state.repeaterReducer),
	(state) => [state.repeaterReducer]
);

export const getControl = (state, fieldName) => {
	return state.repeaterReducer[fieldName];
};
