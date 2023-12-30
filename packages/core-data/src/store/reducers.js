// @flow

export const reducer = (state: Object = {}, action: Object): Object => {
	switch (action?.type) {
		case 'ADD_BOOTSTRAPPED_VARIABLE_GROUP':
			return {
				...state,
				variables: {
					...(state?.variables || {}),
					[action.name]: action.variableGroup,
				},
			};
		case 'ADD_BOOTSTRAPPED_DYNAMIC_VALUE_GROUP':
			return {
				...state,
				dynamicValues: {
					...(state?.dynamicValues || {}),
					[action.name]: action.dynamicValueGroup,
				},
			};
	}
};

export default reducer;
